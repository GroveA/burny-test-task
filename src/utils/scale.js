export function getScale(width, height) {
    var mw = 0;
    var mh = 0;

    if (width > height) {
        mw = (width * 640) / height;
        mh = (height * 960) / width;
    } else {
        mw = (width * 960) / height;
        mh = (height * 640) / width;
    }

    return 1 / Math.max(mw / width, mh / height);
}

export function scaleToSize(object, width, height, min) {
    var body = object;
    var dw = width / body.width;
    var dh = height / body.height;
    var dlt = 1;
    if (body.height * dw >= height) dlt = min ? dh : dw;
    else dlt = min ? dw : dh;

    object.width *= dlt;
    object.height *= dlt;
}
