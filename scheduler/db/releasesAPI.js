import ReleaseVO from './ReleaseVo.js';
import { error, success } from './dbResponse';

function all() {
    return new Promise((resolve) => {
        ReleaseVO.find({}, (err, data) => {
            if (err) {
                resolve(error(err, data.id));
            } else {
                resolve(success(data, data.id));
            }
        });
    });
}

function get_id(data) {
    return new Promise((resolve) => {
        ReleaseVO.findOne({ id: data.id }, (err, newData) => {
            if (newData && newData._id) {
                resolve(newData._id);
            } else {
                resolve(-1);
            }
        });
    });
}

function update(_id, data) {
    return new Promise((resolve) => {
        ReleaseVO.findByIdAndUpdate(_id, data, (err, newData) => {
            if (err) {
                resolve(error(err, data.id));
            } else {
                resolve(success(newData, data.id));
            }
        });
    });
}

function save(data) {
    return new Promise((resolve) => {
        const release = new ReleaseVO(data);
        release.save((err, newData) => {
            if (err) {
                resolve(error(err, data.id));
            } else {
                resolve(success(newData, data.id));
            }
        });
    });
}

function finalize(resolve, result) {
    if (result.success) {
        resolve({
            success: result.success.id,
            successMsg: result.success.msg
        });
    }

    if (result.error) {
        resolve({
            error: result.error.id,
            errorMsg: result.error.msg
        });
    }
}

module.exports = {
    // type = 'release';
    addReleaseToDB: (releaseData) => {
        return new Promise((resolve, reject) => {
            get_id(releaseData).then((_id, getIdErr) => {
                console.log('get_ID', _id, getIdErr);
                if (getIdErr) {
                    resolve({
                        error: releaseData.id,
                        errorMsg: getIdErr
                    });
                }
                if (_id === -1) {
                    // save
                    console.log('save');
                    save(releaseData)
                        .then((result, err) => {
                            if (result) {
                                finalize(resolve, result);
                            } else if (err) {
                                resolve({
                                    error: releaseData.id,
                                    errorMsg: err
                                });
                            }
                        });
                } else {
                    console.log('update');
                    // update
                    update(_id, releaseData)
                        .then((result, err) => {
                            if (result) {
                                finalize(resolve, result);
                            } else if (err) {
                                resolve({
                                    error: releaseData.id,
                                    errorMsg: err
                                });
                            }
                        });
                }
            });
        });
    },

    resetLogs: function() {
    },

    logAll: function() {
        all().then(function(result) {
            console.log(JSON.stringify(result));
        });
    }
};
