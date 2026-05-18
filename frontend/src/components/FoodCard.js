// import { Link } from 'react-router-dom';
import UrgencyBadge from './UrgencyBadge';
import { formatDate } from '../utils/expiry';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=260&fit=crop';

const FoodCard = ({ food, showActions, onReserve, onEdit, onDelete }) => (
  <article className="food-card">
    <div className="food-card-image">
      <img
        src={food.imageUrl || PLACEHOLDER}
        alt={food.foodName}
        loading="lazy"
      />
      <UrgencyBadge expiryDate={food.expiryDate} level={food.urgencyLevel} />
    </div>
    <div className="food-card-body">
      <span className="food-category">{food.category}</span>
      <h3>{food.foodName}</h3>
      <p className="food-store">{food.storeName}</p>
      <p className="food-meta">
        {food.quantity} {food.unit} · Expires {formatDate(food.expiryDate)}
      </p>
      <p className="food-location">{food.pickupLocation}</p>
      <span className={`status-pill status-${food.status}`}>{food.status}</span>
      {showActions && (
        <div className="food-card-actions">
          {onReserve && food.status === 'available' && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => onReserve(food)}
            >
              Reserve
            </button>
          )}
          {onEdit && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => onEdit(food)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => onDelete(food)}
            >
              Remove
            </button>
          )}
          {/* <Link to={`/foods/${food._id}`} className="btn btn-ghost btn-sm">
            Details
          </Link> */}
          {/* details button temporarily removed */}
        </div>
      )}
    </div>
  </article>
);

export default FoodCard;
