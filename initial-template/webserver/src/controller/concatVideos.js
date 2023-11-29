import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export default class VideoConcatenator {
  #downloadsFolder;
  #outputFilePath;

  constructor(downloadsFolder, outputFilePath) {
    this.#downloadsFolder = downloadsFolder;
    this.#outputFilePath = outputFilePath;
  }

  async concatVideos() {
    const convertedVideoFiles = await this.checkAndConvertVideos();

    if (convertedVideoFiles.length < 2) {
      console.error("At least two videos are required for concatenation.");
      return;
    }

    const command = ffmpeg();

    convertedVideoFiles.forEach((file) => {
      command.input(file);
    });

    command.output(this.#outputFilePath);

    command
      .on("end", () => {
        console.log("Concatenation completed successfully.");
      })
      .on("error", (err) => {
        console.error("Error during concatenation:", err);
      })
      .run();
  }

  getVideoFiles() {
    const filesFolderDownloads = fs.readdirSync(this.#downloadsFolder);
    return filesFolderDownloads.filter((file) =>
      /\.(mp4|mkv|avi|webm)$/i.test(file)
    );
  }

  async checkAndConvertVideos() {
    const videoFiles = this.getVideoFiles();
    const convertedVideoFiles = [];

    for (const file of videoFiles) {
      const inputPath = path.join(this.#downloadsFolder, file);
      const outputPath = path.join(this.#downloadsFolder, `converted_${file}`);

      try {
        await this.convertVideo(inputPath, outputPath);
        convertedVideoFiles.push(outputPath);
      } catch (error) {
        console.error(`Error converting video ${inputPath}:`, error);
      }
    }

    return convertedVideoFiles;
  }

  async convertVideo(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .on("end", () => resolve())
        .on("error", (err) => reject(err))
        .run();
    });
  }
}
