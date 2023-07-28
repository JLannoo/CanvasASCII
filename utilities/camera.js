// @ts-check

/**
 * Gets the data from the camera as DataURL.
 * 
 * @param {"user"|"environment"} facing
 * @returns {Promise<String>} DataURL
 */
export function getCameraData(facing) {
    return new Promise((resolve, reject) => {
        const userMediaOptions = {
            video: {
                facingMode: facing
            },
            audio: false
        };

        navigator.mediaDevices.getUserMedia(userMediaOptions)
            .then(stream => {
                const video = document.createElement("video");
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();

                    const canvas = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const context = canvas.getContext("2d");
                    if (context) context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

                    const dataURL = canvas.toDataURL("image/png");

                    resolve(dataURL);

                    stream.getTracks().forEach(track => track.stop());
                };
            })
            .catch(error => {
                reject(error);
            })
    });
}