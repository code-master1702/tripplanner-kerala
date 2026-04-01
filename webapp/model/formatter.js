sap.ui.define([], function () {
    "use strict";

    return {

        /**
         * CONCEPT 1: Custom Formatter - Currency
         * Formats a number as Indian Rupees
         */
        formatCurrency: function (value) {
            if (!value && value !== 0) {
                return "";
            }
            return "₹" + parseFloat(value).toLocaleString("en-IN", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        },

        /**
         * CONCEPT 1: Custom Formatter - Travel Time
         * Formats hours into readable string
         */
        formatTime: function (hours) {
            if (!hours && hours !== 0) {
                return "";
            }
            if (hours < 1) {
                return Math.round(hours * 60) + " min";
            }
            var h = Math.floor(hours);
            var m = Math.round((hours - h) * 60);
            if (m > 0) {
                return h + " hrs " + m + " min";
            }
            return h + " hrs";
        },

        /**
         * CONCEPT 1: Custom Formatter - Rating Stars
         * Converts numeric rating to visual stars
         */
        formatRating: function (rating) {
            if (!rating && rating !== 0) {
                return "";
            }
            var val = parseFloat(rating);
            if (isNaN(val)) {
                return "";
            }
            var fullStars = Math.floor(val);
            var halfStar = (val % 1) >= 0.5 ? 1 : 0;
            var emptyStars = 5 - fullStars - halfStar;
            var stars = "★".repeat(fullStars);
            if (halfStar) {
                stars += "½";
            }
            stars += "☆".repeat(emptyStars);
            return val + " " + stars;
        },

        /**
         * CONCEPT 1: Custom Formatter - Stay Dates
         * Calculates check-in and check-out dates from planDays
         */
        formatStayDates: function (planDays) {
            var startStr = "19-02-2026";
            var parts = startStr.split("-");
            var checkIn = new Date(parts[2], parts[1] - 1, parts[0]);

            if (!planDays || isNaN(planDays)) {
                return "Check-in: " + startStr;
            }

            var checkOut = new Date(checkIn);
            checkOut.setDate(checkIn.getDate() + Number(planDays) - 1);

            function formatDate(date) {
                var dd = String(date.getDate()).padStart(2, '0');
                var mm = String(date.getMonth() + 1).padStart(2, '0');
                var yyyy = date.getFullYear();
                return dd + '-' + mm + '-' + yyyy;
            }

            return "📅 Check-in: " + formatDate(checkIn) + "  |  Check-out: " + formatDate(checkOut);
        },

        /**
         * CONCEPT 1: Custom Formatter - Price Range
         * Adds money icon to price range
         */
        formatPriceRange: function (priceRange) {
            if (!priceRange) {
                return "Price not available";
            }
            return "💰 " + priceRange;
        },

        /**
         * CONCEPT 3: Validation Formatter - Cost State
         * Returns ValueState based on cost thresholds
         * Similar to course: weightMeasure > 5 returns true/false
         */
        formatCostState: function (value) {
            if (!value && value !== 0) {
                return "None";
            }
            var num = parseFloat(value);
            if (num > 5000) {
                return "Error";     // Red - expensive
            } else if (num > 2000) {
                return "Warning";   // Orange - moderate
            }
            return "Success";       // Green - affordable
        },

        /**
         * CONCEPT 3: Validation Formatter - Rating State
         * Returns ValueState based on rating
         */
        formatRatingState: function (rating) {
            if (!rating) {
                return "None";
            }
            var val = parseFloat(rating);
            if (val >= 4.5) {
                return "Success";   // Green - excellent
            } else if (val >= 3.5) {
                return "Warning";   // Orange - average
            }
            return "Error";         // Red - poor
        },

        /**
         * Custom Formatter - Popularity
         * Converts popularity number to text
         */
        formatPopularity: function (popularity) {
            if (!popularity) {
                return "";
            }
            var map = {
                5: "🔥 Very Popular",
                4: "⭐ Popular",
                3: "👍 Moderate",
                2: "📌 Less Known",
                1: "🆕 Hidden Gem"
            };
            return map[popularity] || "";
        },

        /**
         * Custom Formatter - Days Needed
         * Formats days needed into readable string
         */
        formatDaysNeeded: function (days) {
            if (!days) {
                return "";
            }
            if (days === 1) {
                return "⏱ 1 Day Trip";
            }
            return "⏱ " + days + " Days Recommended";
        },

        /**
         * Custom Formatter - Comfort Level Icon Color
         */
        formatComfortState: function (comfort) {
            if (comfort === "High") {
                return "Success";
            } else if (comfort === "Medium") {
                return "Warning";
            }
            return "Error";
        }
    };
});