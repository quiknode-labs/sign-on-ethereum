import { ethers } from "ethers";
export const authenticate = async (
  address: string,
  signature: string,
  nonce: number
) => {
  let authenticated = false;
  const decodedAddress = ethers.utils.verifyMessage(
    nonce.toString(),
    signature
  );
  console.log(decodedAddress, address);
  if (decodedAddress === address)
    authenticated = true;
  return authenticated;
};
