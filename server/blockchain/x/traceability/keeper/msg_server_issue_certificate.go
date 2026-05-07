package keeper

import (
	"context"
	"fmt"

	"greenchain/x/traceability/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func (k msgServer) IssueCertificate(goCtx context.Context, msg *types.MsgIssueCertificate) (*types.MsgIssueCertificateResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// Check if the sender is an authorized admin
	// In a real PoA system, this would check against a list of validator/admin addresses
	if !k.IsAdmin(ctx, msg.Creator) {
		return nil, fmt.Errorf("unauthorized: only admin can issue certificates")
	}

	// Create Soulbound Token (SBT) logic
	// In Cosmos, this is a non-transferable entry in the KVStore
	sbtId := fmt.Sprintf("CERT-%d", k.GetNextCertificateId(ctx))
	
	var cert = types.Certificate{
		Id:        sbtId,
		Recipient: msg.Recipient,
		CertType:  msg.CertType,
		Data:      msg.Data,
		Issuer:    msg.Creator,
		IssuedAt:  ctx.BlockTime().Unix(),
	}

	k.SetCertificate(ctx, cert)

	return &types.MsgIssueCertificateResponse{
		SbtId: sbtId,
	}, nil
}
