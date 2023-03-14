const fs = require('fs');

const openUrl = (url) => {
  const { exec } = require('child_process');
  const os = require('os');

  switch (os.platform()) {
    case 'darwin': exec(`open "${url}"`); break;
    case 'win32': exec(`start "${url}"`); break;
    case 'win64': exec(`start "${url}"`); break;
    default: exec(`xdg-open "${url}"`);
  }
}

const openDevUrl = () => {
  try {
    const deploymentData = JSON.parse(fs.readFileSync('./mud-deployments/mud-deployment-latest.json', 'utf8'));
    const { worldAddress, blockNumber, rpc } = deploymentData;

    const url = `http://localhost:3000/?worldAddress=${worldAddress}&chainId=31337&initialBlockNumber=${blockNumber}&rpc=${rpc}&wsRpc=${rpc.replace('http', 'ws')}&snapshot=&faucet=&dev=true`;
    console.log("Opening dev url: ", url);
    openUrl(url);
  } catch(e) {
    console.error("Error opening dev url: ", e);
  }
}

openDevUrl();