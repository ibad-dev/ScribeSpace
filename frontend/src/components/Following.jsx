import React, { useEffect } from "react";
import { fetchFollowers } from "../features/followersSlice";
import { useDispatch, useSelector } from "react-redux";
import { assets } from "../assets/asset";
import { fetchFollowing } from "../features/followingSlice";

function Following({ userId }) {
  const dispatch = useDispatch();
  const { isLoading, followingCount, followingData, error } = useSelector(
    (state) => state.following
  );

  useEffect(() => {
    if (userId) {
      dispatch(fetchFollowing(userId));
    }
  }, [dispatch, userId]);

  if (isLoading)
    return <p className="text-center text-gray-500">Loading followings...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="lg:max-w-md max-w-80 lg:mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Followings ({followingCount})
      </h2>

      {Array.isArray(followingData) && followingData.length > 0 ? (
        <ul className="space-y-3">
          {followingData.map((following) => (
            <li
              key={following._id}
              className="flex items-center space-x-4 p-2 border-b last:border-none"
            >
              {following.profileImage === "" ? (
                <img
                  src={assets.user}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <img
                  src={following.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
              <span className="text-gray-900 font-medium text-lg">
                {following.username}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No Followings yet.</p>
      )}
    </div>
  );
}

export default Following;
