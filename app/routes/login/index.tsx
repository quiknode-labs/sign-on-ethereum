import { ethers } from "ethers";
import {
  ActionFunction,
  redirect,
  useSubmit,
} from "remix";
import { authenticate } from "~/login";
import { db } from "~/utils/db.server";

declare global {
  interface Window {
    ethereum: any;
  }
}

const getWeb3 = async () => {
  if (window.ethereum) {
    const provider =
      new ethers.providers.Web3Provider(
        window.ethereum
      );
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const nonce = Math.floor(
      Math.random() * 1000000
    );
    const signature = await signer.signMessage(
      nonce.toString()
    );
    return [address, signature, nonce];
  }
  throw new Error("metamask needs to be installed");
};

export const action: ActionFunction = async ({
  request,
}) => {
  const form = await request.formData();
  const address = form.get("address");
  const signature = form.get("signature");
  const nonce = form.get("nonce");
  if (!address || typeof address !== "string")
    return null;
  if (!signature || typeof signature !== "string")
    return null;
  if (!nonce) return null;
  const isAuthenticated = await authenticate(
    address,
    signature,
    nonce as unknown as number
  );
  if (!isAuthenticated) return null;
  const user = await db.user.create({
    data: {
      address: address,
    },
  });
  return redirect(`/login/${user.address}`);
};

export default function Login() {
  const submit = useSubmit();
  async function handleSubmit() {
    const [address, signature, nonce] =
      await getWeb3();
    const formData = new FormData();
    //@ts-ignore
    formData.append("address", address);
    //@ts-ignore
    formData.append("signature", signature);
    //@ts-ignore
    formData.append("nonce", nonce);
    submit(formData, {
      action: "login/?index",
      method: "post",
      encType: "application/x-www-form-urlencoded",
      replace: true,
    });
  }
  return (
    <div>
      <h1>gm</h1>
      <button onClick={handleSubmit}>
        Sign in With Ethereum
      </button>
    </div>
  );
}
