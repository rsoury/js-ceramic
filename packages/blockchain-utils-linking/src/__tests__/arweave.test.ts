import { jest } from '@jest/globals'
import Arweave from 'arweave'
import crypto from 'crypto'
import { ArweaveAuthProvider } from '../arweave.js'

declare module 'crypto' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace webcrypto {
    const subtle: SubtleCrypto
  }
}

const { subtle } = crypto.webcrypto

const did = 'did:3:bafysdfwefwe'
const keyfile = {
  kty: 'RSA',
  n: '0C4FKcMTi81b6Hih3s-qauVO_5Mi3tvCBvgh-Zyqjhwf_aA7PWzYJXlGjEsMKQo5ohk4pdWxiOjnDu7-yWngr_UTCUu2dHxN6N55sA2m3MKZpaFOMZZNg8kOX_Vjur3RMZ-h7J3aTnFBppZ6El1VdKqPvfVEzbFjXnJb682Zf1rpwT7FH4zev9WKwF2kicjTI5Zuo6lmqNkUSe9QQwQoPVoGdY0s3EdJ1koGa7waRS3u7BjswGMeSKZ7cD_f1M_MMKLahwCuBIxPN0szNzRABBKHAfCSYpsLBvUqMrcqV8Vnb48K2vWItJcSV2ViHtT9uG1ayBifZougkdUN5rixnvVHWFD183JKangeQe_Wb2n_J7UHsILJP78WqDQpkwEQ24STLoZVYFWTI_iAuWGXPQDzZtBymdiVigMegn5eCial1kTA-IxeP6RsY7GxPJ6rIqFperyHCA2Iu1V2ZmUD2vIiQTL0zFzOGVEthubMz7G4cJgbPYJV6gh-oqzvLIK80CtkKePd027aKFlyGwq97ttuZlXJudDcvlyF6zROr-3w0OLyqU-PwLHsFTOARDadZYzpRfwT4xE8hCfrEFVbC1e0tI7jjNWP-809vbQc1fvPhna3_APBIx6sHwQ3vrkbomhdiBoZEdMkAMXiBbm_f51dV7msMu3s5aV-x6UvyXs',
  e: 'AQAB',
  d: 'pzMO-oeu_y2kj4WznFx1pv0dAa-O5ibiIu7PescVRKXaG73BVohA4XgR7UOpNJz9xO80zBxhRnCogxn4kJP03d2buG-SzuO3PzzPx1Jvnga9mIWBY9ovz5R_cxqHSsiBZ7WqO3xchXv5Gm7pBC7qH5WNdSe0Zu_9uzFmGnE6w0qlS4u6jqh5juFXW0Dakb81tPNxUQkRZrNS1D7c27ZPC1dusKL-UL0A1JcHqSeegcluhzlNjQcOn5L2uSTUBPwQJ0_k62DkYsq-JM7FB6VzdNHclPY-2-tiY-gsSCdMXsoxVSwxr8JcVY6wMHlA4Tp3vNQ3gVYlUBr8j6PqUlAsdufm-nGW6eHg4h8mzkiFLNC_2A7QTkGThvG8pq39Ofd3Frf5E7niwmYZ7aQfi_2ZnjaI7Df2ToYwpGWbnWrVktgvhhkZ7ClW6J8FKGr3u6wAcAsPYXWz_P878QplNShdsVx0u9kIyqR5egI_4vnh0ME_WP8qlECPLkKhyoPmQFQGOTAtGBPZmipQfDS3S-bgwJh8WyDBempsodCHyB2r2rmhKR9nNtGrbB7w5BgC72E4a4hfKRnZ4l7aLdKryxISv8eGaVNiPz4luwJ_Ea3WEntHbmraz5lECKYjWFYoJHgbx3bCKhzfBK-6L5cwT2lpGJ8DmzB3dBaBJCWmZvrJZAE',
  p: '69ugWPQikhqvluFaM567Eta52S3kKoLP6NH5yt1GZy-3Pvz7q0u6rAbth4PHsqudMYC2jEK6qbOMcYuTi6WH0Cn1ztulScWGEj8UL-D6jjYuc0pzS8KD3J6_rcEVj9qowA0RR-MWlnOHgfcrDoW9rUgEimZBB5jpJIOoVtpmZWw5lVKuoj1rgOf_InhlUx_loa_qwhezjCbZoAlQnSHp6qEGNKMg_EX7IiJ4OVRkdyI4LkPt5UW81J0QWBP61eDqi-vqh7_4ILiDkUAi5Ky2afYaUQ4nC1EKXLYVFknJkLyOpsn68PHMmlD05TW20o3ylEXcUiSSPNzzv8g07uQ0-w',
  q: '4fVJ2rPEf7ffJIGwWheoGCRb96E9OrcdME4YXc0MZfhXEl1G0iKMHVGs_H1SqGA8EStHEoH6Ah9RSg9FXzj_PunDbnvMceoD4JbBh0yFDAVOFMtfbWUeVPBc23IpVSgjG6lAvNet47-uaJ7Iqfjtx0Ys_V4MKfJzSvi3MOZutuUE5nZK8lKKMGOgRQYeY__Q9R-3r34kyvNFV0v7-NYBTXjnpU054YwLRk2xjjlM7NSMAufLBUMqklERRXkNdEguA5GcyapPHcEcaJvdedwEBAmBYVLv0S5F9YPjUxv-TM7nJ4deZauhXSuvDd21rBG7r8GUjv1m2CPfa-qcRyGVgQ',
  dp: '3bJJnJOOU0smNWqJwO-45FJVyuCqEZN4Hl4QsDEh1igx1NEzNqYuRzkT2Ed0VGufjEJyVJD8qDsPDkOmYqMrb-2hEdnAGgHCrjAAp6iPm1EuhEw8579k9uF5RrexrtBXwn4F-k5oku7xNqbAIBxyWAjTy8ul4KBItXvTpiAQE9GQpt1bLUESZc6sMRh-FY5r6HlU7zAcIub5tMZMsgaIu3S0QpH7lWWqU0GXRDwhWyIdMM_FM7dDcY5ZKJFPO-74SKFuiD9X2lnVwZhJtCzsIdmkjwAAj1CTruWwGI0vHA9A_2HnsMd4DK2AJFtDB9NJaznniIa7tt3xeBmWN97mNQ',
  dq: 'cGwZPc4ZYy45wLEh7AE_KhvVAiTgEPmQdTs11l2x4H4p3EI6fUyhB-leNxWnbYzL9gLhTq0Klcm9KSrl6hWysTufd7Xyp262VSTMzyNcQvnUunXhWc1oxPv-R1TKicr5hMa2Jf7tTpZNEVKHJkJrE62vrrP_O1Oc111dz9-mkCrsQDn02hIFHURENnNv5XMfJQaN3qvVZICbLG7qxAi-ByyznEQLG1QRO_5l7AxIYMDzlHJ9SXX8lWXuQPGUpxlOg4oMRy4MRRKSrt112S6FdPjBvYmFNj9eoWPoU65m3RJIYhtw9Qbqty-H3k9EF4OPLUgUQPyFEd7vR4MoFB_6gQ',
  qi: 'KG8wrufCnh7uBf3PfJsLOD_WDAaZjIANvXMijSXIQuFghIx8YWytx6CGLYPegP9KvipCOB-n3uhNYrK1p0Fh-z2K2g9W_Pfxys010qGSfeygywyxtBoC9swMDzozFWynyJg_sBYzTR0jL0cKXbABmwHXXj0uWNKerfvAXvGkf6JWoK0-WFlnOZi5xaBdRdAGfOb1rY8dWuchilY4lvt_GxzOsOkMv-U4VLpbGtdD96Pg4ps4tNPsLJOb0QOfZfJPe7SV8ELZEzufZxadYGc2uRipqmeK4dNoxZRmc_x2D-eDiRNMVsbuP3djVyyOPj8CbvUFfTVFCKPE5IDONFEUjQ',
}
const address = 'SYfSd7ZU5noAK50Dp4x7XqVNwLt7FBHYaU_voaCX9-o'

class ArweaveMockSigner {
  // See ArConnect for Reference https://github.com/th8ta/ArConnect/blob/a69812548139ca8859cb1472bef683c222ce126b/src/background/api/encryption.ts#L208
  // The following `signature` method is an implementation of the ArConnect Wallet signature method
  public async signature(data: Uint8Array, options: { name: string; saltLength: number }) {
    const cryptoKey = await subtle.importKey(
      'jwk',
      keyfile,
      {
        name: 'RSA-PSS',
        hash: {
          name: 'SHA-256',
        },
      },
      false,
      ['sign']
    )

    const signature = await subtle.sign(options, cryptoKey, new Uint8Array(Object.values(data)))

    return new Uint8Array(signature)
  }
}

beforeAll(() => {
  global.Date.now = jest.fn().mockImplementation(() => 666000)
})

afterAll(() => {
  jest.clearAllMocks()
})

describe('Blockchain: Arweave', () => {
  describe('createLink', () => {
    test('create proof for arweave', async () => {
      const provider = new ArweaveMockSigner()
      const authProvider = new ArweaveAuthProvider(provider, address)
      const proof = await authProvider.createLink(did)
      expect(proof).toMatchSnapshot()
    })
  })

  describe('authenticate', () => {
    test('create proof for arweave', async () => {
      const provider = new ArweaveMockSigner()
      const authProvider = new ArweaveAuthProvider(provider, address)
      const result = await authProvider.authenticate('msg')
      expect(result).toMatchSnapshot()
    })
  })
})
