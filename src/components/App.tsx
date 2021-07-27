import {Web3ReactProvider} from '@web3-react/core';
import {Web3Provider} from '@ethersproject/providers';
import {Page} from './Page';

function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
}

export const App = () => {
    return (
        <Web3ReactProvider getLibrary={getLibrary}>
            <Page />
        </Web3ReactProvider>
    );
};
