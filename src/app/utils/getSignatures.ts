export const sigs = [
  'https://mrs6x6ew7njwnad27dkhear7ya0tzbjy.lambda-url.eu-north-1.on.aws/',
  'https://7iurhujz7zfo4gx65p7ws7wliy0gaexu.lambda-url.eu-north-1.on.aws/',
  'https://3jb2sp2i7x27xmcol2qsetcvse0jgtzp.lambda-url.eu-north-1.on.aws/',
  'https://hvktatipoqgc74s6su4j3h273i0gaotl.lambda-url.us-east-1.on.aws/'
];

export const requiredSignatures = 3;

const fetchSig = async (url: string) => {
  try {
    const res = await fetch(url);
    return res;
  } catch (e) {
    console.log(e);
    setTimeout(async () => {
      return await fetchSig(url);
    }, 1000);
  }
};

const getSignaturesClaim = async (hash: string, chainId: string) => {
  const signatures: any[] = [];
  let respJSON: any;

  async function checkSignature(i: number) {
    const url = `${sigs[i]}auth?tx=${hash}&chain=${chainId}`;
    const resp = await fetchSig(url);
    respJSON = await resp.json();

    if (respJSON.isSuccess) {
      signatures.push(respJSON.signature);
      if (signatures.length >= requiredSignatures) {
        return { signatures, respJSON };
      }
    }

    // Some tests showed that this could cause infinite loop

    // else if (respJSON.message.includes('Confirming')) {
    //   return new Promise((resolve) => {
    //     setTimeout(async () => {
    //       const result = await checkSignature(i);
    //       resolve(result);
    //     }, 1000);
    //   });
    // }
  }

  for (let i = 0; i < sigs.length; i++) {
    await checkSignature(i);
  }

  return { signatures, respJSON };
};

export const getSignaturesAddWrapped = async (token: `0x${string}`, chainId: number) => {
  const signatures: any[] = [];
  let respJSON: any;

  for (let i = 0; i < sigs.length; i++) {
    const url = `${sigs[i]}addToken?token=${token}&chain=${chainId}`;
    const resp = await fetchSig(url);
    respJSON = await resp.json();

    if (respJSON.isSuccess) {
      signatures.push(respJSON.signature);
      if (signatures.length >= requiredSignatures) {
        return { signatures, respJSON };
      }
    }
  }

  return { signatures: [], respJSON };
};

// const getFirstSig = async (url: string) => {
//   const resp = await fetchSig(url);
//   const respJSON = await resp.json();

//   if (!respJSON.isSuccess) {
//     // alert('ERROR - 1: Authorization failed!');
//     return null;
//   }
//   return respJSON.signature;
// };

// const getSecondSig = async (url: string) => {
//   const url = `${sigs[1]}tx=${hash}&chain=${chainId}`;
//   const resp = await fetchSig(url);
//   const respJSON = await resp.json();

//   if (!respJSON.isSuccess) {
//     // alert('ERROR - 2: Authorization failed!');
//     return null;
//   }
//   return respJSON.signature;
// };

// const getThirdSig = async (hash: string, chainId: string) => {
//   const url = `${sigs[2]}tx=${hash}&chain=${chainId}`;
//   const resp = await fetchSig(url);
//   const respJSON = await resp.json();

//   if (!respJSON.isSuccess) {
//     // alert('ERROR - 3: Authorization failed!');
//     return { sig3: null, respJSON: null };
//   }
//   return { sig3: respJSON.signature, respJSON };
// };

export default getSignaturesClaim;
