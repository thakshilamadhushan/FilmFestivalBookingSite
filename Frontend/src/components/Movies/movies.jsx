import "./movies.css";
import movies from "../../data/movies";
import MovieCard from "./movieCard";

function Festival(){

    return(

        <section className="festival" id="movies">
            <div className="festivalHeading">
                <div>
                    <p>JUL 16–17, 2026</p>
                    <h1>Festival Screenings</h1>
                </div>
                <h4>Students' Center - GWUIM</h4>
            </div>

            <div className="movieGrid">

                {

                movies.map(movie=>(

                    <MovieCard
                    key={movie.id}
                    movie={movie}
                    />

                ))

                }

            </div>

        </section>

    )

}

export default Festival;