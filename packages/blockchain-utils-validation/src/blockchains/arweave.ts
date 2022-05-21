import { BlockchainHandler } from '../blockchain-handler.js'
import { LinkProof } from '@ceramicnetwork/blockchain-utils-linking'
import { normalizeAccountId } from '@ceramicnetwork/common'
import Arweave from 'arweave/node'
import uint8arrays from 'uint8arrays'

const { crypto } = Arweave
const namespace = 'ar'

export async function validateLink(proof: LinkProof): Promise<LinkProof | null> {
  // Handle legacy CAIP links
  const account = normalizeAccountId(proof.account)
  const msg = uint8arrays.fromString(proof.message)
  const sig = uint8arrays.fromString(proof.signature)
  const recover = await crypto.verify(account.address, msg, sig)
  if (recover) {
    return proof
  } else {
    return null
  }
}

export const handler: BlockchainHandler = {
  namespace,
  validateLink,
}
