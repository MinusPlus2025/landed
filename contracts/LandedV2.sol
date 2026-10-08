// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "./Landed.sol";

/// @title LandedV2 - V1 plus mutual change requests, arbiter rotation, two-step ownership and mutual cancel.
/// @notice V1 description:
///         Landed - funded job board and milestone escrow for cross-border freelance work
/// @notice A client posts a job with its full budget locked up front ("funded job"), freelancers
///         apply, the client hires one, and each milestone is released on approval. If the client
///         goes silent after a delivery, the freelancer can claim the milestone once the review
///         window passes. Either side can raise a dispute that a neutral arbiter settles.
///         Completed jobs and disputes build a public on-chain track record for both parties.
contract LandedV2 {
    enum Status { Open, Active, Disputed, Completed, Cancelled, Resolved }
    enum MilestoneState { Pending, Submitted, Paid }

    struct Job {
        address client;
        address freelancer;
        address token;
        uint256 budget;
        uint256 released;
        uint64 createdAt;
        uint64 reviewWindow; // seconds the client has to review a delivery
        uint32 current; // index of the active milestone
        Status status;
        string title;
        string details;
        string category;
    }

    struct Milestone {
        string name;
        uint256 amount;
        MilestoneState state;
        uint64 submittedAt;
        string delivery; // link to the delivered work
    }

    struct Application {
        address freelancer;
        string pitch;
        uint64 at;
    }

    struct Record {
        uint32 jobsCompleted; // as freelancer
        uint32 jobsPosted; // as client
        uint32 jobsPaidOut; // as client, finished and fully paid
        uint32 disputes;
        uint256 earned;
        uint256 spent;
    }

    struct ChangeProposal {
        address proposer;
        uint64 reviewWindow;
        string[] names;
        uint256[] amounts;
    }

    address public arbiter;
    address public owner;
    address public pendingOwner;
    mapping(uint256 => ChangeProposal) internal proposals;
    mapping(uint256 => address) public cancelRequestedBy;
    Job[] internal jobs;
    mapping(uint256 => Milestone[]) internal milestones;
    mapping(uint256 => mapping(address => bool)) public applied;
    mapping(uint256 => Application[]) internal applications;
    mapping(address => Record) public records;

    event JobPosted(uint256 indexed jobId, address indexed client, address token, uint256 budget, string title, bool direct);
    event Applied(uint256 indexed jobId, address indexed freelancer, string pitch);
    event Hired(uint256 indexed jobId, address indexed freelancer);
    event Delivered(uint256 indexed jobId, uint256 milestone, string delivery);
    event Released(uint256 indexed jobId, uint256 milestone, uint256 amount, bool byTimeout);
    event Disputed(uint256 indexed jobId, address indexed by);
    event Resolved(uint256 indexed jobId, uint256 toFreelancer, uint256 toClient);
    event Cancelled(uint256 indexed jobId);
    event Completed(uint256 indexed jobId);

    event ArbiterChanged(address indexed previous, address indexed next);
    event OwnershipTransferStarted(address indexed previous, address indexed next);
    event OwnershipTransferred(address indexed previous, address indexed next);
    event ChangeProposed(uint256 indexed jobId, address indexed by, uint256 newRemaining, uint64 reviewWindow);
    event ChangeAccepted(uint256 indexed jobId, address indexed by, uint256 oldRemaining, uint256 newRemaining);
    event ChangeCancelled(uint256 indexed jobId, address indexed by);
    event MutualCancelRequested(uint256 indexed jobId, address indexed by);
    event MutualCancelWithdrawn(uint256 indexed jobId, address indexed by);
    event MutuallyCancelled(uint256 indexed jobId, uint256 refunded);

    error NotOwner();
    error NotClient();
    error NotFreelancer();
    error NotParty();
    error NotArbiter();
    error BadState();
    error BadInput();
    error ReviewWindowOpen();
    error TransferFailed();

    constructor(address arbiter_) {
        if (arbiter_ == address(0)) revert BadInput();
        arbiter = arbiter_;
        owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
        emit ArbiterChanged(address(0), arbiter_);
    }

    // ---------------------------------------------------------------- admin (V2)

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    /// @notice Rotate the arbiter. Disputed jobs are settled by whoever is arbiter at resolve time.
    function setArbiter(address next) external onlyOwner {
        if (next == address(0)) revert BadInput();
        emit ArbiterChanged(arbiter, next);
        arbiter = next;
    }

    /// @notice Step 1 of 2: nominate a new owner (address(0) clears a pending nomination).
    function transferOwnership(address next) external onlyOwner {
        pendingOwner = next;
        emit OwnershipTransferStarted(owner, next);
    }

    /// @notice Step 2 of 2: the nominee accepts.
    function acceptOwnership() external {
        if (msg.sender != pendingOwner || msg.sender == address(0)) revert NotOwner();
        emit OwnershipTransferred(owner, msg.sender);
        owner = msg.sender;
        pendingOwner = address(0);
    }

    // ---------------------------------------------------------------- posting

    /// @notice Post a funded job: the whole budget is pulled into escrow now.
    function postJob(
        string calldata title,
        string calldata details,
        string calldata category,
        address token,
        string[] calldata names,
        uint256[] calldata amounts,
        uint64 reviewWindow
    ) external returns (uint256 id) {
        id = _create(title, details, category, token, names, amounts, reviewWindow);
        emit JobPosted(id, msg.sender, token, jobs[id].budget, title, false);
    }

    /// @notice A private deal already agreed off-platform: fund it and hire the freelancer in one step.
    function postDirect(
        address freelancer,
        string calldata title,
        string calldata details,
        string calldata category,
        address token,
        string[] calldata names,
        uint256[] calldata amounts,
        uint64 reviewWindow
    ) external returns (uint256 id) {
        if (freelancer == address(0) || freelancer == msg.sender) revert BadInput();
        id = _create(title, details, category, token, names, amounts, reviewWindow);
        Job storage j = jobs[id];
        j.freelancer = freelancer;
        j.status = Status.Active;
        emit JobPosted(id, msg.sender, token, j.budget, title, true);
        emit Hired(id, freelancer);
    }

    function _create(
        string calldata title,
        string calldata details,
        string calldata category,
        address token,
        string[] calldata names,
        uint256[] calldata amounts,
        uint64 reviewWindow
    ) internal returns (uint256 id) {
        if (names.length == 0 || names.length != amounts.length || names.length > 10) revert BadInput();
        if (reviewWindow < 60 || reviewWindow > 30 days) revert BadInput();
        uint256 budget;
        id = jobs.length;
        for (uint256 i; i < amounts.length; i++) {
            if (amounts[i] == 0) revert BadInput();
            budget += amounts[i];
            milestones[id].push(Milestone(names[i], amounts[i], MilestoneState.Pending, 0, ""));
        }
        jobs.push(Job(msg.sender, address(0), token, budget, 0, uint64(block.timestamp), reviewWindow, 0, Status.Open, title, details, category));
        records[msg.sender].jobsPosted += 1;
        if (!IERC20(token).transferFrom(msg.sender, address(this), budget)) revert TransferFailed();
    }

    // ---------------------------------------------------------------- hiring

    function applyTo(uint256 id, string calldata pitch) external {
        Job storage j = jobs[id];
        if (j.status != Status.Open) revert BadState();
        if (msg.sender == j.client || applied[id][msg.sender]) revert BadInput();
        applied[id][msg.sender] = true;
        applications[id].push(Application(msg.sender, pitch, uint64(block.timestamp)));
        emit Applied(id, msg.sender, pitch);
    }

    function hire(uint256 id, address freelancer) external {
        Job storage j = jobs[id];
        if (msg.sender != j.client) revert NotClient();
        if (j.status != Status.Open) revert BadState();
        if (!applied[id][freelancer]) revert BadInput();
        j.freelancer = freelancer;
        j.status = Status.Active;
        emit Hired(id, freelancer);
    }

    /// @notice The client can withdraw an open job (nobody hired yet) and get the budget back.
    function cancel(uint256 id) external {
        Job storage j = jobs[id];
        if (msg.sender != j.client) revert NotClient();
        if (j.status != Status.Open) revert BadState();
        j.status = Status.Cancelled;
        _pay(j.token, j.client, j.budget);
        emit Cancelled(id);
    }

    // ---------------------------------------------------------------- delivery

    function deliver(uint256 id, string calldata delivery) external {
        Job storage j = jobs[id];
        if (msg.sender != j.freelancer) revert NotFreelancer();
        if (j.status != Status.Active) revert BadState();
        Milestone storage m = milestones[id][j.current];
        if (m.state == MilestoneState.Paid) revert BadState();
        m.state = MilestoneState.Submitted;
        m.submittedAt = uint64(block.timestamp);
        m.delivery = delivery;
        emit Delivered(id, j.current, delivery);
    }

    function approve(uint256 id) external {
        Job storage j = jobs[id];
        if (msg.sender != j.client) revert NotClient();
        _release(id, false);
    }

    /// @notice The client went silent: after the review window the freelancer gets paid anyway.
    function claimAfterTimeout(uint256 id) external {
        Job storage j = jobs[id];
        if (msg.sender != j.freelancer) revert NotFreelancer();
        Milestone storage m = milestones[id][j.current];
        if (m.state != MilestoneState.Submitted) revert BadState();
        if (block.timestamp < m.submittedAt + j.reviewWindow) revert ReviewWindowOpen();
        _release(id, true);
    }

    function _release(uint256 id, bool byTimeout) internal {
        Job storage j = jobs[id];
        if (j.status != Status.Active) revert BadState();
        uint256 idx = j.current;
        Milestone storage m = milestones[id][idx];
        if (m.state != MilestoneState.Submitted) revert BadState();
        m.state = MilestoneState.Paid;
        j.released += m.amount;
        records[j.freelancer].earned += m.amount;
        records[j.client].spent += m.amount;
        _pay(j.token, j.freelancer, m.amount);
        emit Released(id, idx, m.amount, byTimeout);
        _clearPending(id);
        if (idx + 1 == milestones[id].length) {
            j.status = Status.Completed;
            records[j.freelancer].jobsCompleted += 1;
            records[j.client].jobsPaidOut += 1;
            emit Completed(id);
        } else {
            j.current = uint32(idx + 1);
        }
    }

    // ---------------------------------------------------------------- disputes

    function dispute(uint256 id) external {
        Job storage j = jobs[id];
        if (msg.sender != j.client && msg.sender != j.freelancer) revert NotParty();
        if (j.status != Status.Active) revert BadState();
        j.status = Status.Disputed;
        _clearPending(id);
        records[msg.sender == j.client ? j.freelancer : j.client].disputes += 1;
        emit Disputed(id, msg.sender);
    }

    /// @notice The arbiter splits whatever is still in escrow.
    function resolve(uint256 id, uint256 toFreelancer) external {
        if (msg.sender != arbiter) revert NotArbiter();
        Job storage j = jobs[id];
        if (j.status != Status.Disputed) revert BadState();
        uint256 remaining = j.budget - j.released;
        if (toFreelancer > remaining) revert BadInput();
        j.status = Status.Resolved;
        j.released = j.budget;
        records[j.freelancer].earned += toFreelancer;
        records[j.client].spent += toFreelancer;
        _pay(j.token, j.freelancer, toFreelancer);
        _pay(j.token, j.client, remaining - toFreelancer);
        emit Resolved(id, toFreelancer, remaining - toFreelancer);
    }

    // ---------------------------------------------------------------- change requests (V2)

    /// @notice Either party proposes new terms for the milestones not yet released (index >= current).
    ///         The other party accepts; if the new remaining total is higher the client tops up,
    ///         if lower the difference is refunded to the client.
    function proposeChange(uint256 id, string[] calldata names, uint256[] calldata amounts, uint64 reviewWindow) external {
        Job storage j = jobs[id];
        if (msg.sender != j.client && msg.sender != j.freelancer) revert NotParty();
        if (j.status != Status.Active) revert BadState();
        if (proposals[id].proposer != address(0)) revert BadState();
        if (milestones[id][j.current].state != MilestoneState.Pending) revert BadState(); // don't rewrite work under review
        if (names.length == 0 || names.length != amounts.length) revert BadInput();
        if (j.current + names.length > 10) revert BadInput();
        if (reviewWindow < 60 || reviewWindow > 30 days) revert BadInput();
        uint256 total;
        for (uint256 i; i < amounts.length; i++) {
            if (amounts[i] == 0) revert BadInput();
            total += amounts[i];
        }
        ChangeProposal storage p = proposals[id];
        p.proposer = msg.sender;
        p.reviewWindow = reviewWindow;
        for (uint256 i; i < names.length; i++) {
            p.names.push(names[i]);
            p.amounts.push(amounts[i]);
        }
        emit ChangeProposed(id, msg.sender, total, reviewWindow);
    }

    function acceptChange(uint256 id) external {
        Job storage j = jobs[id];
        ChangeProposal storage p = proposals[id];
        if (p.proposer == address(0) || j.status != Status.Active) revert BadState();
        if (msg.sender != j.client && msg.sender != j.freelancer) revert NotParty();
        if (msg.sender == p.proposer) revert BadInput();
        uint256 oldRemaining = j.budget - j.released;
        uint256 newRemaining;
        Milestone[] storage ms = milestones[id];
        uint256 cur = j.current;
        while (ms.length > cur) ms.pop();
        for (uint256 i; i < p.names.length; i++) {
            newRemaining += p.amounts[i];
            ms.push(Milestone(p.names[i], p.amounts[i], MilestoneState.Pending, 0, ""));
        }
        j.budget = j.released + newRemaining;
        j.reviewWindow = p.reviewWindow;
        delete proposals[id];
        delete cancelRequestedBy[id];
        if (newRemaining > oldRemaining) {
            if (!IERC20(j.token).transferFrom(j.client, address(this), newRemaining - oldRemaining)) revert TransferFailed();
        } else {
            _pay(j.token, j.client, oldRemaining - newRemaining);
        }
        emit ChangeAccepted(id, msg.sender, oldRemaining, newRemaining);
    }

    function cancelChange(uint256 id) external {
        Job storage j = jobs[id];
        if (proposals[id].proposer == address(0)) revert BadState();
        if (msg.sender != j.client && msg.sender != j.freelancer) revert NotParty();
        delete proposals[id];
        emit ChangeCancelled(id, msg.sender);
    }

    function getProposal(uint256 id) external view returns (ChangeProposal memory) {
        return proposals[id];
    }

    // ---------------------------------------------------------------- mutual cancel (V2)

    function requestMutualCancel(uint256 id) external {
        Job storage j = jobs[id];
        if (msg.sender != j.client && msg.sender != j.freelancer) revert NotParty();
        if (j.status != Status.Active) revert BadState();
        if (cancelRequestedBy[id] != address(0)) revert BadState();
        cancelRequestedBy[id] = msg.sender;
        emit MutualCancelRequested(id, msg.sender);
    }

    /// @notice The requester can take the request back.
    function withdrawMutualCancel(uint256 id) external {
        if (cancelRequestedBy[id] != msg.sender || msg.sender == address(0)) revert BadState();
        delete cancelRequestedBy[id];
        emit MutualCancelWithdrawn(id, msg.sender);
    }

    /// @notice The other party confirms: remaining escrow goes back to the client.
    function confirmMutualCancel(uint256 id) external {
        Job storage j = jobs[id];
        address by = cancelRequestedBy[id];
        if (by == address(0) || j.status != Status.Active) revert BadState();
        if (msg.sender != j.client && msg.sender != j.freelancer) revert NotParty();
        if (msg.sender == by) revert BadInput();
        uint256 remaining = j.budget - j.released;
        j.status = Status.Cancelled;
        j.released = j.budget;
        _clearPending(id);
        _pay(j.token, j.client, remaining);
        emit MutuallyCancelled(id, remaining);
        emit Cancelled(id);
    }

    function _clearPending(uint256 id) internal {
        if (proposals[id].proposer != address(0)) delete proposals[id];
        if (cancelRequestedBy[id] != address(0)) delete cancelRequestedBy[id];
    }

    // ---------------------------------------------------------------- views

    function jobCount() external view returns (uint256) {
        return jobs.length;
    }

    function getJob(uint256 id) external view returns (Job memory) {
        return jobs[id];
    }

    function getMilestones(uint256 id) external view returns (Milestone[] memory) {
        return milestones[id];
    }

    function getApplications(uint256 id) external view returns (Application[] memory) {
        return applications[id];
    }

    function _pay(address token, address to, uint256 amount) internal {
        if (amount == 0) return;
        if (!IERC20(token).transfer(to, amount)) revert TransferFailed();
    }
}
