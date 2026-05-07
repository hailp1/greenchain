package keeper

import (
	"context"

	"greenchain/x/traceability/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) CreateBatch(goCtx context.Context, msg *types.MsgCreateBatch) (*types.MsgCreateBatchResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Define the batch object
	var batch = types.Batch{
		Creator: msg.Creator,
		Hash:    msg.Hash,
		Timestamp: ctx.BlockTime().Unix(),
	}

	// Store the batch in the state
	k.AppendBatch(ctx, batch)

	return &types.MsgCreateBatchResponse{}, nil
}
