import "./movieCard.css";
import {FaStar,FaClock,FaMapMarkerAlt,FaCalendar} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function MovieCard({movie}){

    const navigate = useNavigate();

    return(

        <div className="movieCard">

            <div className="poster" style={{backgroundImage:`url(${movie.poster})`}}>

                <div className="top">

                    <span className="rating">

                    <FaStar/>

                    {movie.imdb}

                    </span>

                </div>

            </div>

            <div className="info">

                <h2>{movie.title}</h2>

                <h5>{movie.genre}</h5>

                <div className="details">

                    <p><FaClock/>{movie.duration}</p>

                    <p>{movie.language}</p>

                </div>

                <div className="dates">

                    {movie.dates.map(date=><span key={date}><FaCalendar/>{date}</span>)}

                </div>

                <div className="times">

                    {movie.times.map(time=><span key={time}><FaClock/>{time}</span>)}

                </div>

                <button onClick={() => navigate("/booking")}>Book Seat →</button>

            </div>

        </div>

    )

}

export default MovieCard;