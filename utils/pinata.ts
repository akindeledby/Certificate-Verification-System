import axios from "axios";

const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;
const PINATA_GATEWAY =
  process.env.NEXT_PUBLIC_GATEWAY_URL || "https://gateway.pinata.cloud";

if (!PINATA_JWT) {
  throw new Error("Pinata JWT is missing in environment variables");
}

export const pinata = {
  upload: {
    file: async (file: File, metadata?: Record<string, any>) => {
      const formData = new FormData();
      formData.append("file", file);

      if (metadata) {
        formData.append(
          "pinataMetadata",
          JSON.stringify({ name: file.name, keyvalues: metadata.keyvalues })
        );
      }

      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return res.data; // Ensure it returns { IpfsHash, Timestamp, etc. }
    },
  },

  gateways: {
    convert: (ipfsHash: string) => `${PINATA_GATEWAY}/ipfs/${ipfsHash}`,
  },
};
