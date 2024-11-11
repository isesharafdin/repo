import https from 'https';  // Import the https module

// Define the package name as a variable
const packageName = 'yonode';  // Change this to any package name as needed

// Define the versions array from the uploaded image data (example array based on the image).
const versions = [
    { version: '1.2.4', downloads: 0 },
    { version: '1.2.3', downloads: 0 },
    { version: '1.2.2', downloads: 0 },
    { version: '1.2.1', downloads: 0 },
    { version: '1.2.0', downloads: 0 }
];

// Define the weights for download distribution
const downloadWeights = [10, 5, 3, 2, 1];
const totalWeight = downloadWeights.reduce((acc, weight) => acc + weight, 0);
const totalDownloads = 1000;

// Calculate the target downloads for each version based on weights
versions.forEach((v, index) => {
    v.targetDownloads = Math.round((downloadWeights[index] / totalWeight) * totalDownloads);
});

// Function to perform a single download with delay
function downloadWithDelay(version, targetDownloads, interval, downloadCount = 0) {
    if (downloadCount < targetDownloads) {
        const url = `https://registry.npmjs.org/${packageName}/-/${packageName}-${version}.tgz`;

        https.get(url, (res) => {
            if (res.statusCode === 200) {
                versions.find(v => v.version === version).downloads++;
                console.log(`Downloaded version ${version}: ${downloadCount + 1} times (Target: ${targetDownloads})`);
            } else {
                console.error(`Failed to download version ${version} with status code: ${res.statusCode}`);
            }
        }).on('error', (error) => {
            console.error(`Error fetching URL for version ${version}:`, error);
        });

        setTimeout(() => downloadWithDelay(version, targetDownloads, interval, downloadCount + 1), interval);
    }
}

// Function to start the download simulation with a delay
function simulateDownloads() {
    versions.forEach((v) => {
        downloadWithDelay(v.version, v.targetDownloads, 3000); // 3000 ms = 3 seconds
    });
}

// Start the download simulation
simulateDownloads();
