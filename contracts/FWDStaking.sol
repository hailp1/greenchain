// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FWDStaking is Ownable {
    IERC20 public stakingToken;

    struct Stake {
        uint256 amount;
        uint256 timestamp;
        uint256 pendingRewards;
    }

    mapping(address => Stake) public stakes;
    
    // 12.4% APR -> approximately 0.00000000393 per second
    uint256 public constant REWARD_RATE_PER_SECOND = 393; // Multiplied by 1e10 for precision
    uint256 public totalStaked;

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(address _stakingToken) Ownable(msg.sender) {
        stakingToken = IERC20(_stakingToken);
    }

    function stake(uint256 _amount) external {
        require(_amount > 0, "Cannot stake 0");
        
        // Update pending rewards before modifying stake
        updateReward(msg.sender);

        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        stakes[msg.sender].amount += _amount;
        totalStaked += _amount;

        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external {
        require(_amount > 0, "Cannot withdraw 0");
        require(stakes[msg.sender].amount >= _amount, "Insufficient stake");

        updateReward(msg.sender);

        stakes[msg.sender].amount -= _amount;
        totalStaked -= _amount;

        require(stakingToken.transfer(msg.sender, _amount), "Transfer failed");

        emit Withdrawn(msg.sender, _amount);
    }

    function claimReward() external {
        updateReward(msg.sender);
        
        uint256 reward = stakes[msg.sender].pendingRewards;
        require(reward > 0, "No rewards to claim");

        stakes[msg.sender].pendingRewards = 0;
        
        // In a real scenario, this contract needs a balance of tokens to pay out rewards.
        require(stakingToken.transfer(msg.sender, reward), "Reward transfer failed");

        emit RewardClaimed(msg.sender, reward);
    }

    function calculateReward(address _user) public view returns (uint256) {
        Stake memory userStake = stakes[_user];
        if (userStake.amount == 0) return userStake.pendingRewards;

        uint256 timeElapsed = block.timestamp - userStake.timestamp;
        
        // REWARD_RATE_PER_SECOND is scaled by 1e10, so we divide by 1e10 at the end
        uint256 newReward = (userStake.amount * timeElapsed * REWARD_RATE_PER_SECOND) / 1e10;
        
        return userStake.pendingRewards + newReward;
    }

    function updateReward(address _user) internal {
        stakes[_user].pendingRewards = calculateReward(_user);
        stakes[_user].timestamp = block.timestamp;
    }

    // Helper to get stake details
    function getStakeInfo(address _user) external view returns (uint256 amount, uint256 rewards) {
        return (stakes[_user].amount, calculateReward(_user));
    }
}
