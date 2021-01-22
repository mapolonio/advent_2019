const { getInput } = require('../utils');

const parseInput = (input) => {
  const [pixelsText] = input.split('\n');

  return pixelsText.split('').map((n) => parseInt(n, 10));
};

const getLayers = (pixels, width, height) => {
  const layers = [];

  for (let i = 0; i < pixels.length; i += 1) {
    const pixel = pixels[i];

    if (i % (width * height) === 0) {
      layers.push([]);
    }

    const layer = layers[layers.length - 1];

    if (i % width === 0) {
      layer.push([]);
    }

    const row = layer[layer.length - 1];

    row.push(pixel);
  }

  return layers;
};

const mergeLayers = (layers, width, height) => {
  const result = [];

  for (let row = 0; row < height; row += 1) {
    let imageRow = '';

    for (let col = 0; col < width; col += 1) {
      imageRow += getPixel(layers, row, col);
    }

    result.push(imageRow);
  }

  return result.join('\n');
};

const getPixel = (layers, row, col) => {
  let result;

  for (const layer of layers) {
    const pixel = layer[row][col];

    if (pixel !== 2) {
      result = pixel;
      break;
    }
  }

  return result === 1 ? '#' : ' ';
};

const main = async (inputPath = 'day8/input', width = 25, height = 6) => {
  const pixels = await getInput(inputPath, parseInput);
  const layers = getLayers(pixels, width, height);
  const picture = mergeLayers(layers, width, height);

  return `\n${picture}`;
};

module.exports = { getLayers, main };
