import {
  Approval as ApprovalEvent,
  Transfer as TransferEvent,
} from "../generated/templates/LaunchpadToken/LaunchpadToken";
import { Approval, Transfer, TokenBalance } from "../generated/schema";
import { BigInt, Address } from "@graphprotocol/graph-ts";

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  // Update balances
  let fromId = event.address
    .toHex()
    .concat("-")
    .concat(event.params.from.toHex());
  let toId = event.address.toHex().concat("-").concat(event.params.to.toHex());

  // Check and update sender's balance unless it's a minting operation
  if (event.params.from != Address.zero()) {
    let fromBalance = TokenBalance.load(fromId);
    if (fromBalance == null) {
      fromBalance = new TokenBalance(fromId);
      fromBalance.holder = event.params.from;
      fromBalance.token = event.address.toHex();
      fromBalance.balance = new BigInt(0);
    }
    // Subtract the transferred amount
    fromBalance.balance = fromBalance.balance.minus(event.params.value);
    fromBalance.save();
  }

  // Check and update receiver's balance unless it's a burning operation
  if (event.params.to != Address.zero()) {
    let toBalance = TokenBalance.load(toId);
    if (toBalance == null) {
      toBalance = new TokenBalance(toId);
      toBalance.holder = event.params.to;
      toBalance.token = event.address.toHex();
      toBalance.balance = new BigInt(0);
    }
    // Add the transferred amount
    toBalance.balance = toBalance.balance.plus(event.params.value);
    toBalance.save();
  }
}
