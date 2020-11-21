const autoCompleteConfig = {
    // Render each movie option in dropdown
    renderOption(movie) {
        const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
        return `
            <img src="${imgSrc}"/>
            ${movie.Title} (${movie.Year})
        `;
    },
    // Change input value to the selected movie title
    inputValue(movie) {
        return movie.Title
    },
    // Fetch movies based on search input
    async fetchData(searchTerm) {
        const response = await axios.get('http://www.omdbapi.com/', {
            params: {
                apikey: 'a1f890d6',
                s: searchTerm
            }
        });
    
        if (response.data.Error) {
            return [];
        }
    
        return response.data.Search;
    }
};

createAutoComplete({
    // Copy everything inside of autoCompleteConfig
    ...autoCompleteConfig,
    // Location in HTML where left autocomplete is located
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie) {
        // Hide tutorial when user clicks on a movie option
        document.querySelector('.tutorial').classList.add('is-hidden');
        // Fetch data from API on the selected option and render it to the page
        onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
    },
});

createAutoComplete({
    // Copy everything inside of autoCompleteConfig
    ...autoCompleteConfig,
    // Location in HTML where right autocomplete is located
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie) {
        // Hide tutorial when user clicks on a movie option
        document.querySelector('.tutorial').classList.add('is-hidden');
        // Fetch data from API on the selected option and render it to the page
        onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
    },
});

let leftMovie;
let rightMovie;
// Fetch detailed data about a selected movie
const onMovieSelect = async (movie, summaryElement, side) => {
    const response = await axios.get('http://www.omdbapi.com/', {
        params: {
            apikey: 'a1f890d6',
            i: movie.imdbID
        }
    });

    summaryElement.innerHTML = movieTemplate(response.data);

    if (side === 'left') {
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }

    if (leftMovie && rightMovie) {
        runComparison();
    }
};

// Compare stats for left side movie and right side movie and style them based on "winner"
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    leftSideStats.forEach((leftStat, index) => {
        const rightStat = rightSideStats[index];

        const leftSideValue = parseInt(leftStat.dataset.value);
        const rightSideValue = parseInt(rightStat.dataset.value);

        if (rightSideValue > leftSideValue) {
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');
        } else if (rightSideValue < leftSideValue) {
            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        }
    })
}

// HTML for movie details
const movieTemplate = (movieDetail) => {
    // Turns a string like '$635,000,000' into the number 635000000
    const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    // Turn metascore string into number
    const metascore = parseInt(movieDetail.Metascore);
    // Turn imdb rating string into number
    const imdbRating = parseFloat(movieDetail.imdbRating);
    // Turns imdb votes string into a number without commas
    const imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    // Get total number of awards
    const awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
        const value = parseInt(word);

        if (isNaN(value)) {
            return prev;
        } else {
            return prev + value;
        }
    }, 0);

    return `
        <article class="media">
            <figure class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}">
                </p>
            </figure>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title}</h1>
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>

        <article data-value=${awards} class="notification is-primary">
            <p class="title">${movieDetail.Awards}</p>
            <p class="subtitle">Awards</p>
        </article>
        <article data-value=${dollars} class="notification is-primary">
            <p class="title">${movieDetail.BoxOffice}</p>
            <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification is-primary">
            <p class="title">${movieDetail.Metascore}</p>
            <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification is-primary">
            <p class="title">${movieDetail.imdbRating}</p>
            <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification is-primary">
            <p class="title">${movieDetail.imdbVotes}</p>
            <p class="subtitle">IMDB Votes</p>
        </article>
    `;
};