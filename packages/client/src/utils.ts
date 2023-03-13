import { ethers } from "ethers";

export function toBytes16(input: string) {
  if (input.length > 16) throw new Error("String does not fit into 16 bytes");

  const result = new Uint8Array(16);
  // Set ascii bytes
  for (let i = 0; i < input.length; i++) {
    result[i] = input.charCodeAt(i);
  }
  // Set the remaining bytes to 0
  for (let i = input.length; i < 16; i++) {
    result[i] = 0;
  }
  return result;
}

export function concatBytes(a: Uint8Array, b: Uint8Array) {
  const result = new Uint8Array(a.length + b.length);
  for (let i = 0; i < a.length; i++) {
    result[i] = a[i];
  }
  for (let i = 0; i < b.length; i++) {
    result[a.length + i] = b[i];
  }
  return result;
}

function toHexString(input: Uint8Array): string {
  let output = "0x";

  for (let i = 0; i < input.length; i++) {
    output += input[i].toString(16).padStart(2, "0");
  }

  return output;
}

export function getTableId(namespace: string, tableName: string) {
  return toHexString(concatBytes(toBytes16(namespace), toBytes16(tableName)));
}

export function sigHash(signature: string) {
  return ethers.utils.hexDataSlice(
    ethers.utils.keccak256(ethers.utils.toUtf8Bytes(signature)),
    0,
    4
  );
}
