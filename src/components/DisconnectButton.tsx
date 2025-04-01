import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

function DisconnectButton() {
    const {logout} = useAuth();
    const navigate = useNavigate();
    function disconnect(): void {
        logout();
        navigate('/login');
    }


    return <button
    className="nes-btn is-warning"
    onClick={() => disconnect()}
>
    Déconnexion
</button>
}

export default DisconnectButton;