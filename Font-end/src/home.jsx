import Navbar from "./component/navbar";
import PictureSlideshow from "./component/pictureSlideshow";
import Category from "./component/category";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);

export default function Home() {
    if (localStorage.getItem("access_token")) {
        return(
        <div>
            <Navbar />
                <main>
                    <PictureSlideshow />
                    <Category />
                </main>
        </div>
        );
    } else {

        MySwal.fire({
            icon: 'error',
            title: 'Cannot access',
            text: 'You do not have access to this content.',
        })
        
        return <Navigate to="/" replace />;

    }
    
}
