document.addEventListener('DOMContentLoaded', function () {
    const filmDropdown = document.querySelector('#film-dropdown');
    const movieDetails = document.querySelector('.selected-movie');
    const buyTicketBtn = document.querySelector('.buy-ticket-btn');
    const ticketPurchasedMsg = document.querySelector('.ticket-purchased-msg');

    function updateMovieDetails(movie) {
        movieDetails.querySelector('img').src = movie.poster;
        movieDetails.querySelector('h3').textContent = movie.title;
        movieDetails.querySelector('p').textContent = `Showtime: ${movie.showtime}`;
        const availableTickets = movie.capacity - movie.tickets_sold;
        buyTicketBtn.textContent = availableTickets > 0 ? 'Buy Ticket' : 'Sold Out';
        ticketPurchasedMsg.textContent = '';
    }

    function loadMovieDetails(movieId) {
        fetch(`http://localhost:3000/films/${movieId}`)
            .then(response => response.json())
            .then(movie => {
                updateMovieDetails(movie);
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
            });
    }

    function populateFilmDropdown(films) {
        filmDropdown.innerHTML = films.map(film => {
            return `<option value="${film.id}">${film.title}</option>`;
        }).join('');
    }

    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            populateFilmDropdown(films);

            // Load and display details of the first movie initially
            loadMovieDetails(films[0].id);

            // Add change event listener to film dropdown
            filmDropdown.addEventListener('change', function () {
                const selectedMovieId = filmDropdown.value;
                loadMovieDetails(selectedMovieId);
            });

            // Add click event listener to buy ticket button
            buyTicketBtn.addEventListener('click', function () {
                const selectedMovieId = filmDropdown.value;
                const selectedMovie = films.find(movie => movie.id === selectedMovieId);
                const availableTickets = selectedMovie.capacity - selectedMovie.tickets_sold;

                if (availableTickets > 0) {
                    selectedMovie.tickets_sold += 1;
                    updateMovieDetails(selectedMovie);
                    ticketPurchasedMsg.textContent = 'Ticket purchased successfully!';
                } else {
                    ticketPurchasedMsg.textContent = 'Tickets are sold out!';
                }
            });
        })
        .catch(error => {
            console.error('Error fetching film data:', error);
        });
});
