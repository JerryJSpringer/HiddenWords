
function getDateString(date) {

	// Dates
	var now = new Date();
	var old = new Date(date);
	
	var val = dateHelper(now.getFullYear() - old.getFullYear(), 'year');
	if (val) return val;

	val = dateHelper(now.getMonth() - old.getMonth(), 'month');
	if (val) return val;

	val = dateHelper(now.getDate() - old.getDate(), 'day');
	if (val) return val;

	val = dateHelper(now.getHours() - old.getHours(), 'hours');
	if (val) return val;

	val = dateHelper(now.getMinutes() - old.getMinutes(), 'minute');
	if (val) return val;

	val = dateHelper(now.getSeconds() - old.getSeconds(), 'second');
	if (val) return val;

	return 'now';
}

function dateHelper(diff, text) {
	if (diff > 1)
		return diff + ' ' + text + 's ago';
	else if (diff == 1)
		return diff + ' ' + text + ' ago';
	else
		return '';
}

module.exports = {
	getDateString: getDateString
}