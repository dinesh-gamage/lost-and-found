import * as React from 'react'

interface ILoginPageProps {
    onLogin: () => void
}

const LoginPage: React.FunctionComponent<ILoginPageProps> = (props) => {

    // props 
    let { onLogin } = props

    // states
    let [username, setUsername] = React.useState<string>("")
    let [password, setPassword] = React.useState<string>("")

    return (<div className="mda-login-page">
        <div className="frosted-backdrop"></div>

        <div className="content">
            <div className="header">
                <div className="title">Experience <span className="dark"> Madinah</span></div>
                <div className="logo-cont">
                    <div className="logo"></div>
                    <div className="text">Welcome</div>
                </div>
            </div>

            <div className="form">
                <div className="section">
                    <input type="text"
                        value={username} className=""
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="section">
                    <input type="password" className=""
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}

                    />
                </div>
                <div className="section">
                    <button className="btn login" onClick={onLogin} >Login</button>
                </div>
                <div className="section">
                    <button className="btn forgot-pass">Forgot password</button>
                </div>
            </div>


            <div className="footer">
                <a href="http://spaceworx.io" > powered by spaceworx.io </a>
            </div>
        </div>

    </div>)
}

export default LoginPage