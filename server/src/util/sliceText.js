const sliceText = text => {
  return text.replace(/\s+/g, ' ').trim().slice(0, 256)
}

module.exports.sliceText = sliceText
