const Spot = ({spot}) => {
    console.log(spot)

    return (
    <div className="spot">
        <img src={spot.previewImage} className="spot-image" />
        <div className="spot-info">
            <div className="title">{spot.name}</div>
            <div>{spot.description}</div>
            <div>{`$${spot.price}`} <span className="night">night</span></div>
        </div>
    </div>
    )    
}

export default Spot;
