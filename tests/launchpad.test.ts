import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { BondingCurveFractionSet } from "../generated/schema"
import { BondingCurveFractionSet as BondingCurveFractionSetEvent } from "../generated/Launchpad/Launchpad"
import { handleBondingCurveFractionSet } from "../src/launchpad"
import { createBondingCurveFractionSetEvent } from "./launchpad-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newFraction = BigInt.fromI32(234)
    let oldFraction = BigInt.fromI32(234)
    let newBondingCurveFractionSetEvent = createBondingCurveFractionSetEvent(
      newFraction,
      oldFraction
    )
    handleBondingCurveFractionSet(newBondingCurveFractionSetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BondingCurveFractionSet created and stored", () => {
    assert.entityCount("BondingCurveFractionSet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BondingCurveFractionSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "newFraction",
      "234"
    )
    assert.fieldEquals(
      "BondingCurveFractionSet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "oldFraction",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
