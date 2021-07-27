const express = require("express");
const cors = require("cors");
const path = require("path");
const Web3 = require("web3");
require("dotenv").config();
const ERC721ABI = require("./abi/ERC721.abi.json");

const contractAddress = "0x60F80121C31A0d46B5279700f9DF786054aa5eE5";
const ethNetwork = process.env.INFURA_LINK;
const keyId = 1143999;
const tokenId = 1144007;

let web3;

try {
	web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));
} catch (e) {
	console.log("Connection Error!", e);
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.post("/image", async (req, res, next) => {
	if (!web3) {
		res.status(404).json("Currently there is no connection to mainnet...");
		return;
	}

	const {sig, account} = req.body;

	let ownedTokenIds = {};

	try {
		const ERC721 = new web3.eth.Contract(ERC721ABI, contractAddress);
		const balance = await ERC721.methods.balanceOf(account).call();
		for (let i = 0; i < balance; i++) {
			const tokenId = await ERC721.methods
				.tokenOfOwnerByIndex(account, i)
				.call();
			ownedTokenIds[tokenId] = true;
		}
	} catch (e) {
		console.log(e);
		res.status(404).json("Currently there is no connection to mainnet...");
		return;
	}

	const hasKey = ownedTokenIds[keyId];
	const hasToken = ownedTokenIds[tokenId];

	if (!hasKey && !hasToken) {
		res.status(401).json("You own neither NFT nor the key");
		return;
	}

	if (!hasKey) {
		res.status(401).json(
			"You own NFT but not the key. No one can own both"
		);
		return;
	}

	const hasBothTokens = hasKey && hasToken;

	const signer = web3.eth.accounts.recover(
		"Burn the money for burntheart",
		sig
	);
	const isTheSameSigner = signer === account;

	if (isTheSameSigner && hasBothTokens) {
		try {
			res.sendFile(
				path.join(__dirname, process.env.IMAGE_NAME),
				(err) => {
					if (err) {
						console.log("Error occured while sending file", err);
					}
				}
			);
		} catch (e) {
			res.status(404).json("Error occured while sending image");
			return;
		}
	}
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
	console.log(`Express app listening on localhost:${port}`)
);
