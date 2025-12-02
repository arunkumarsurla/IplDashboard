import {BrowserRouter, Routes, Route, Link, useParams} from "react-router-dom"
import {useEffect, useState} from "react"
import "./App.css"


const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [teamsData, setTeamsData] = useState([])

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await fetch("https://apis.ccbp.in/ipl")
      const data = await response.json()
      const formatted = data.teams.map(team => ({
        id: team.id,
        name: team.name,
        teamImageURL: team.team_image_url,
      }))
      setTeamsData(formatted)
      setIsLoading(false)
    }
    fetchTeams()
  }, [])

  return (
    <div className="home-route-container">
      <div className="teams-list-container">
        <div className="ipl-dashboard-heading-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ipl-logo-img.png"
            className="ipl-logo"
            alt="ipl logo"
          />
          <h1 className="ipl-dashboard-heading">2020 IPL Dashboard</h1>
        </div>

        {isLoading ? (
          <div><p>Loading...</p></div>
        ) : (
          <ul className="teams-list">
            {teamsData.map(team => (
              <li key={team.id} className="team-item">
                <Link to={`/team-matches/${team.id}`} className="link">
                  <img src={team.teamImageURL} className="team-logo" alt={team.name} />
                  <p className="team-name">{team.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


const LatestMatch = ({latest}) => {
  const {
    competingTeam,
    date,
    venue,
    result,
    competingTeamLogo,
    firstInnings,
    secondInnings,
    manOfTheMatch,
    umpires,
  } = latest

  return (
    <div className="latest-match-container">
      <h1 className="latest-match-heading">Latest Matches</h1>

      <div className="latest-match-card">
        <div className="latest-match-details-logo-container">
          <div className="latest-match-details-1">
            <p className="latest-match-team-name">{competingTeam}</p>
            <p className="latest-match-date">{date}</p>
            <p className="match-details">{venue}</p>
            <p className="match-details">{result}</p>
          </div>

          <img
            src={competingTeamLogo}
            className="latest-match-team-logo"
            alt={`latest match ${competingTeam}`}
          />
        </div>

        <hr className="separator" />

        <div className="latest-match-details-2">
          <p className="latest-match-details-label">First Innings</p>
          <p className="latest-match-details-value">{firstInnings}</p>

          <p className="latest-match-details-label">Second Innings</p>
          <p className="latest-match-details-value">{secondInnings}</p>

          <p className="latest-match-details-label">Man Of The Match</p>
          <p className="latest-match-details-value">{manOfTheMatch}</p>

          <p className="latest-match-details-label">Umpires</p>
          <p className="latest-match-details-value">{umpires}</p>
        </div>
      </div>
    </div>
  )
}


const MatchCard = ({match}) => {
  const {competingTeamLogo, competingTeam, matchStatus, result} = match

  return (
    <li className="match-item">
      <img
        src={competingTeamLogo}
        className="competing-team-logo"
        alt={`competing team ${competingTeam}`}
      />
      <p className="competing-team-name">{competingTeam}</p>
      <p className="result">{result}</p>
      <p className={`match-status ${matchStatus === "Won" ? "match-won" : "match-lost"}`}>
        {matchStatus}
      </p>
    </li>
  )
}


const TeamMatches = () => {
  const {id} = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [teamMatchesData, setTeamMatchesData] = useState({})

  const format = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  useEffect(() => {
    const getMatches = async () => {
      const response = await fetch(`https://apis.ccbp.in/ipl/${id}`)
      const data = await response.json()

      const formatted = {
        teamBannerURL: data.team_banner_url,
        latestMatch: format(data.latest_match_details),
        recentMatches: data.recent_matches.map(m => format(m)),
      }

      setTeamMatchesData(formatted)
      setIsLoading(false)
    }

    getMatches()
  }, [id])

  return (
    <div className={`team-matches-container ${id.toLowerCase()}`}>
      {isLoading ? (
        <div><p>Loading...</p>
        </div>
      ) : (
        <div className="responsive-container">
          <img
            src={teamMatchesData.teamBannerURL}
            alt="team banner"
            className="team-banner"
          />

          <LatestMatch latest={teamMatchesData.latestMatch} />

          <ul className="recent-matches-list">
            {teamMatchesData.recentMatches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const NotFound = () => <h1 className="not-found">Page Not Found</h1>


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team-matches/:id" element={<TeamMatches />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
