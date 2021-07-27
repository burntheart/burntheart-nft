import {useState, useEffect} from "react";
import {useWeb3React} from "@web3-react/core";
import {InjectedConnector} from "@web3-react/injected-connector";
import {Web3Provider} from "@ethersproject/providers";
import Web3 from "web3";
import Modal from "react-modal";
import Loader from "react-loader-spinner";
import {isMobile} from "react-device-detect";

import {Networks} from "../utils";
import {useEagerConnect} from "../hooks/useEagerConnect";
import {useInactiveListener} from "../hooks/useInactiveListener";
import {Logo} from "./Logo";

export const injectedConnector = new InjectedConnector({
	supportedChainIds: [Networks.MainNet, Networks.Rinkeby],
});

Modal.setAppElement("#root");

export const Page = () => {
	const [activatingConnector, setActivatingConnector] = useState();
	const [image, setImage] = useState<string>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [message, setMessage] = useState<string>(null);
	const [isLoading, setIsLoading] = useState(false);

	const {account, activate, active, connector} = useWeb3React<Web3Provider>();

	const triedEager = useEagerConnect();
	useInactiveListener(!triedEager || !!activatingConnector);

	useEffect(() => {
		if (active) {
			presignMessage();
		}
	}, [active]);

	useEffect(() => {
		if (activatingConnector && activatingConnector === connector) {
			console.log("aaaa");

			setActivatingConnector(undefined);
		}
	}, [activatingConnector, connector]);

	const handleClick = async () => {
		if (active) {
			await presignMessage();
			return;
		}
		await activate(injectedConnector);
	};

	const presignMessage = async () => {
		const web3 = new Web3(Web3.givenProvider);
		const sig = await web3.eth.personal.sign(
			"Burn the money for burntheart",
			account,
			""
		);

		setIsLoading(true);

		const res = await getImage(sig, account);

		if (res.status === 200) {
			const blob = await res.blob();
			setImage(URL.createObjectURL(blob));
			toggleModal();
			setIsLoading(false);
			return;
		}

		const parsedRes = await res.json();
		setMessage(parsedRes);
		setIsLoading(false);
	};

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen);
	};

	const getImage = (sig: string, account: string) => {
		return fetch("/image", {
			method: "POST",
			mode: "cors",
			cache: "no-cache",
			credentials: "same-origin",
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify({sig, account}),
		});
	};

	return (
		<div className="wrapper">
			<div className="header">
				<Logo className="logo" />
				{!isMobile && (
					<button className="btn btn__wallet" onClick={handleClick}>
						{active
							? account.slice(0, 6) +
							  "..." +
							  account.slice(account.length - 4)
							: "Connect Wallet"}
					</button>
				)}
				<span className="header__msg">{message}</span>
			</div>
			<div>
				<div style={{padding: "56.25% 0 0 0", position: "relative"}}>
					<iframe
						src="https://player.vimeo.com/video/579410910?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
						frameBorder="0"
						allow="autoplay; fullscreen; picture-in-picture"
						allowFullScreen
						style={{
							position: "absolute",
							top: "0",
							left: "0",
							width: "100%",
							height: "100%",
						}}
						title="Burntheart"
					></iframe>
				</div>
				<script src="https://player.vimeo.com/api/player.js"></script>
			</div>
			<div className="text">
				<p>
					{`Thousands of years ago man tamed fire and began to create
					the first objects of art. Art has changed throughout this
					time. Fire has not. We know what the fire looks like. But we
					do not always understand whether something is an object of
					art. We sometimes create it without even realizing it. We
					buy and sell it at auctions. What is real art? Do we know?
					How much can we spend on it? How far can we go with this? Is
					this madness? No one will ever give an answer because it is
					not clear where to start from. No one knows. You need to
					start from something eternal. From fire. I brought
					everything to one denominator. Here is my manifesto to
					humanity. Here is what I did. I painted a picture. Is this
					art? No one knows. I set it on fire, I burnt it. But before
					that I took a photo. Is this art? No one knows. I encrypted
					the photo and created an `}
					<a
						href="https://rarible.com/token/0x60f80121c31a0d46b5279700f9df786054aa5ee5:1144007?tab=details"
						target="_blank"
						rel="noopener noreferrer"
						className="text__link-inline"
					>
						NFT
					</a>
					{`. Is this art? No one knows. I "burnt" the `}
					<a
						href="https://rarible.com/token/0x60f80121c31a0d46b5279700f9df786054aa5ee5:1143999?tab=details"
						target="_blank"
						rel="noopener noreferrer"
						className="text__link-inline"
					>
						key
					</a>
					{` — `}
					<a
						href="https://etherscan.io/tx/0x91a3f528ed7da4d53ec6ac3526274c5cd5c78dcc13042eb13c08dbfb79fcad32"
						target="_blank"
						rel="noopener noreferrer"
						className="text__link-inline"
					>
						sent
					</a>
					{` it to zero address. And now anyone can burn their money
					by buying NFT while no one knows what it is exactly.
					Probably this is art... No one knows. This is absolute idea
					of art, this is absolute idea of its perception, this is
					absolute idea of evaluating art and buying it. This is my
					creation. Finally, is this art? No one knows. Only I know.
					But nobody knows me. And my heart will be burnt.`}
				</p>
				<br />
				<p>
					If you have both NFT and a key on your wallet — you’ll see the painting. But you won’t, ever.
				</p>
				<br />
				<p>
					<a
						href="https://github.com/burntheart"
						target="_blank"
						rel="noopener noreferrer"
					>
						github.com/burntheart
					</a>
				</p>
			</div>
			<div className="market">
				<a
					href="https://opensea.io/0x4b25282bb93b7d6e4f66e75af13b6fe4ce8a129f"
					target="_blank"
					rel="noopener noreferrer"
					className="btn"
				>
					View on Market
				</a>
			</div>
			<Modal
				isOpen={isModalOpen}
				onRequestClose={toggleModal}
				shouldCloseOnOverlayClick={true}
				className="modal"
				overlayClassName="overlay"
			>
				<button onClick={toggleModal} className="close-btn">
					<svg
						width="16"
						height="16"
						viewBox="0 0 16 16"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M1.95098 0.334735C1.50467 -0.111578 0.781049 -0.111578 0.334735 0.334735C-0.111578 0.781049 -0.111578 1.50467 0.334735 1.95098L6.38376 8L0.334735 14.049C-0.111578 14.4953 -0.111578 15.219 0.334735 15.6653C0.781049 16.1116 1.50467 16.1116 1.95098 15.6653L8 9.61625L14.049 15.6653C14.4953 16.1116 15.219 16.1116 15.6653 15.6653C16.1116 15.219 16.1116 14.4953 15.6653 14.049L9.61625 8L15.6653 1.95098C16.1116 1.50467 16.1116 0.781049 15.6653 0.334735C15.219 -0.111578 14.4953 -0.111578 14.049 0.334735L8 6.38376L1.95098 0.334735Z"
							fill="white"
						/>
					</svg>
				</button>
				{image && <img className="image" src={image} alt="secret" />}
			</Modal>
			<Modal
				isOpen={isLoading}
				className="modal2"
				overlayClassName="overlay2"
			>
				<Loader type="TailSpin" color="#fff" height={100} width={100} />
			</Modal>
		</div>
	);
};
