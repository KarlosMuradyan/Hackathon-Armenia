var sum = (array) => {
        let total = 0;
        for (let i=0; i<array.length; i++) {
                total += array[i];
        }
        return total;
};

var getMean = (array) => {
        let arraySum = sum(array);
        return arraySum / array.length;
};

var getVariances = (user_bid, mean) => {
        let results = [];
        for (i in user_bid) {
                results.push(Math.abs(mean - user_bid[i]));
        }
        return results;
};

var getPercentiles = (variences) => {
        let results = [];
        let sumOfVariences = sum(variences);
	if (sumOfVariences === 0) {
		return variences;
	}
        for (i in variences) {
                results.push(variences[i]/sumOfVariences);
        }
        return results;
};

var reversePercentiles = (percentiles) => {
        let results = [];
        for (i in percentiles) {
                results.push(1/(1 + percentiles[i]));
        }
        return results;
};

var getCorrectAnswer = (source_data, user_data) => {
        let results = Array(source_data.length).fill(0);
        for (ud in user_data) {
		for (sd in source_data) {
                        if (source_data[sd] === user_data[ud]) {
                                results[source_data.indexOf(source_data[sd])]++;
                        }
		}
	}
        let max_indexes = [], i = -1;
        while ((i = results.indexOf(Math.max(...results), i+1)) != -1){
                max_indexes.push(i);
        }
        if (!!results.reduce(function(a, b){ return (a === b) ? a : NaN; }) &&
                results(0) === 0) {
                return [];
        }
        let answers = [];
        max_indexes.forEach((i) => {
                answers.push(source_data[i]);
        });
        return max_indexes;
};

var doValidation = (source_data, user_data, user_bid) => {
        let sd = source_data.map(Number);
        let ud = user_data.map(Number);
        let ub = user_bid.map(Number);
        let ca = getCorrectAnswer(sd, ud);
        if (ca.length === 0) {
                return {
                        errorCode: 1,
                        errorMessage: "No voted result matched with source data"
                };
        }
        var winners = [];
        for (ind in ca) {
                let res = [], i = -1;
                while ((i = ud.indexOf(sd[ca[ind]], i+1)) != -1){
                        res.push(i);
                }
                winners = winners.concat(res);
        }

        // Calculate prizes
        let mean = getMean(ub);
        let variences = getVariances(ub, mean);
        let percentiles = getPercentiles(variences);
        // Reverse percentiles so users with less variances get higher prizes
        let prizePercentiles = reversePercentiles(percentiles);
        let totalPrize = 0;
        for (i in ub) {
                if (!winners.includes(i)) {
                        totalPrize += ub[i];
                }
        }

        console.log("Winners: ", winners);
        console.log("Mean: ", mean);
        console.log("Correct Answers: ", ca);
        console.log("Total Prize: ", totalPrize);
        console.log("Variences: ", variences);
        console.log("Percentiles: ", percentiles);
        console.log("Prize Percentiles: ", prizePercentiles);

        return {
                correctAnswers: ca,
                winners: winners,
                meanBid: mean,
                totalPrize: totalPrize,
                prizePercentiles: prizePercentiles,
                errorCode: 0,
                errorMessage: ""
        };
};

module.exports = {
	doValidation
};
