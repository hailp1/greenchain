package keeper

import (
	"context"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"fwdlifechain/x/fwdlife/types"
)

// Logic xử lý lệnh Stake AGRI
func (k msgServer) StakeAgri(goCtx context.Context, msg *types.MsgStakeAgri) (*types.MsgStakeAgriResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Lấy địa chỉ người gửi
	creator, _ := sdk.AccAddressFromBech32(msg.Creator)

	// Kiểm tra số dư và thực hiện chuyển vào module staking của chuỗi
	err := k.bankKeeper.SendCoinsFromAccountToModule(ctx, creator, types.ModuleName, sdk.NewCoins(msg.Amount))
	if err != nil {
		return nil, err
	}

	// Lưu trạng thái staking vào sổ cái (State Machine)
	k.SetStakingInfo(ctx, msg.Creator, msg.Amount)

	return &types.MsgStakeAgriResponse{
		TxHash: ctx.TxBytes().String(),
	}, nil
}

// Logic xử lý lệnh nhận thưởng
func (k msgServer) ClaimRewards(goCtx context.Context, msg *types.MsgClaimRewards) (*types.MsgClaimRewardsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)
	
	// Tính toán phần thưởng dựa trên thời gian và số lượng đã stake
	rewardAmount := k.CalculateRewards(ctx, msg.Creator)
	
	rewardCoin := sdk.NewCoin("agri", rewardAmount)
	
	// Chuyển thưởng cho người dùng từ quỹ của module
	creator, _ := sdk.AccAddressFromBech32(msg.Creator)
	k.bankKeeper.SendCoinsFromModuleToAccount(ctx, types.ModuleName, creator, sdk.NewCoins(rewardCoin))

	return &types.MsgClaimRewardsResponse{
		Amount: rewardCoin,
	}, nil
}
