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

const getLayerWithLeastZeroes = (layers) => {
  let result;
  let zeroes = Infinity;

  for (const layer of layers) {
    const layerZeroes = countPixels(layer, 0);

    if (layerZeroes < zeroes) {
      result = layer;
      zeroes = layerZeroes;
    }
  }

  return result;
};

const countPixels = (layer, pixelType) => {
  let total = 0;

  for (const row of layer) {
    for (const pixel of row) {
      if (pixel === pixelType) {
        total += 1;
      }
    }
  }

  return total;
};

const main = async (inputPath = 'day8/input', width = 25, height = 6) => {
  const pixels = await getInput(inputPath, parseInput);
  const layers = getLayers(pixels, width, height);
  const leastZeroesLayer = getLayerWithLeastZeroes(layers);
  const ones = countPixels(leastZeroesLayer, 1);
  const twos = countPixels(leastZeroesLayer, 2);

  return ones * twos;
};

module.exports = { getLayers, main };
