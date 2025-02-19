import React, { useEffect } from "react";
import { fetchFollowers } from "../features/followersSlice";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "../assets/asset";

function Followers({ userId }) {
  const dispatch = useDispatch();
  const { isLoading, followersCount, followersData, error } = useSelector(
    (state) => state.followers
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchFollowers(userId));
    }
  }, [dispatch, userId]);

  if (isLoading)
    return <p className="text-center text-gray-500">Loading followers...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="lg:max-w-md max-w-80 lg:mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Followers ({followersCount})
      </h2>

      {Array.isArray(followersData) && followersData.length > 0 ? (
        <ul className="space-y-3">
          {followersData.map((follower) => (
            <li
              key={follower._id}
              className="flex items-center space-x-4 p-2 border-b last:border-none"
            >
              {follower.profileImage === "" ? (
                <img
                  src={assets.user}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <img
                  src={follower.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <span className="text-gray-900 font-medium text-lg">
                {follower.username}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No followers yet.</p>
      )}
    </div>
  );
}

export default Followers;
