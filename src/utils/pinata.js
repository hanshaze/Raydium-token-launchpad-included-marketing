import axios from 'axios';

const PINATA_API_KEY = process.env.REACT_APP_PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.REACT_APP_PINATA_SECRET_KEY;

export const uploadToPinata = async (file, metadata) => {
    if (!file) return null;

    try {
        const formData = new FormData();
        formData.append('file', file);

        // Pin the image file to IPFS
        const imageUploadRes = await axios.post(
            'https://api.pinata.cloud/pinning/pinFileToIPFS',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                },
            }
        );

        const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageUploadRes.data.IpfsHash}`;

        // Create a complete metadata object with all the enhanced fields
        const metadataJSON = {
            name: metadata.name,
            symbol: metadata.symbol,
            description: metadata.description,
            image: imageUrl,
            external_url: metadata.external_url || null,
            seller_fee_basis_points: metadata.seller_fee_basis_points || 0,
            properties: {
                files: [
                    {
                        uri: imageUrl,
                        type: file.type,
                    },
                ],
                category: "token",
                creators: metadata.properties?.creators || [
                    {
                        address: metadata.properties?.creators?.[0]?.address || "",
                        share: 100,
                    },
                ],
            },
        };

        // Add supply information if provided
        if (metadata.supply) {
            metadataJSON.supply = metadata.supply;
        }

        // Add social links if they exist
        if (metadata.links && metadata.links.length > 0) {
            metadataJSON.links = metadata.links;
        }

        // Pin the metadata JSON to IPFS
        const metadataRes = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            metadataJSON,
            {
                headers: {
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                },
            }
        );

        return {
            metadataUri: `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`,
            imageUri: imageUrl,
            imageHash: imageUploadRes.data.IpfsHash,
            metadataHash: metadataRes.data.IpfsHash,
        };
    } catch (error) {
        console.error('Error uploading to Pinata:', error);
        throw new Error(
            'Failed to upload to Pinata: ' +
            (error.response?.data?.message || error.message)
        );
    }
};

/**
 * Converts an IPFS hash to a gateway URL for easier access
 * @param {string} ipfsHash - The IPFS hash/CID
 * @param {string} gateway - Optional gateway URL, defaults to Pinata's gateway
 * @returns {string} Full URL to access the content
 */
export const getIpfsGatewayUrl = (
    ipfsHash,
    gateway = 'https://gateway.pinata.cloud'
) => {
    if (!ipfsHash) return null;

    // Handle if the hash already contains the full URL
    if (ipfsHash.startsWith('http')) {
        return ipfsHash;
    }

    // Handle if the hash already contains ipfs://
    if (ipfsHash.startsWith('ipfs://')) {
        return `${gateway}/ipfs/${ipfsHash.replace('ipfs://', '')}`;
    }

    // Regular hash, just append to gateway URL
    return `${gateway}/ipfs/${ipfsHash}`;
};

export const testPinataConnection = async () => {
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
        return false;
    }

    try {
        const response = await axios.get(
            'https://api.pinata.cloud/data/testAuthentication',
            {
                headers: {
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                },
            }
        );
        return response.status === 200;
    } catch (error) {
        console.error('Pinata connection test failed:', error);
        return false;
    }
}; 