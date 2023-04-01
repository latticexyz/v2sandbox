import { Contract } from "ethers";

export const parseError = (
  contract: Contract,
  errorData: string
): string | null => {
  for (const [, errorFragment] of Object.entries(contract.interface.errors)) {
    if (errorData.startsWith(contract.interface.getSighash(errorFragment))) {
      // const args = contractInterface.decodeErrorResult(errorFragment, errorData)
      return errorFragment.name;
    }
  }
  return null;
};

export const extractContractError = (
  contract: Contract,
  error: any
): string => {
  console.dir(error);

  console.log(contract.interface);

  // Attempt to extract Solidity error
  const errorData = error.error?.data?.originalError?.data;
  if (typeof errorData === "string") {
    const parsedError = parseError(contract, errorData);
    if (parsedError) return parsedError;
  }

  // Read calls will revert differently
  try {
    const response = JSON.parse(error.error.response);
    const errorData = response.error.data;
    console.log("found error data in error response, read call?", errorData);
    if (typeof errorData === "string") {
      const parsedError = parseError(contract, errorData);
      if (parsedError) return parsedError;
    }
  } catch (error) {
    // do nothing with the parse error so we can continue on
  }

  // Otherwise return error reason
  if (typeof error.reason === "string") {
    return error.reason;
  }
  // Fall back to error message
  return error.message;
};
