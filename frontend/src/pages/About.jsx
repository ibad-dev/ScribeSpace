import React from "react";

function About() {
  return (
    <div className="border-2 flex flex-col gap-y-3">
      <div className="p-4">
        <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl  text-center">
          Welcome to ScribeSpace
        </h1>
        <p className="lg:text-xl text-lg my-2">
          ScribeSpace is a community-driven blogging platform where writers and
          readers come together to share ideas, inspire, and learn from each
          other. Our mission is to provide a platform for bloggers to express
          themselves, connect with like-minded individuals, and grow their
          audience.
        </p>
      </div>
      <div className="p-4">
        <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl  text-center">
          Our Story
        </h1>
        <p className="lg:text-xl text-lg my-2">
          Our Story ScribeSpace is a passionate writer and blogger. The idea was
          born out of a desire to create a space where writers could share their
          work, get feedback, and support one another. Today, our platform has
          grown into a thriving community of bloggers from all over the world.
        </p>
      </div>
      <div className="p-4">
        <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl  text-center">
          Our Values
        </h1>
        <ul className="lg:text-xl text-lg">
          <li className="lg:text-xl text-lg my-2">
            {" "}
            <h3 className="font-semibold my-1"> Freedom of Expression:</h3> We
            believe in giving writers the freedom to express themselves without
            fear of censorship or judgment.{" "}
          </li>
          <li className="lg:text-xl text-lg my-2">
            {" "}
            <h3 className="font-semibold my-1"> Community Support</h3> We strive
            to create a supportive environment where writers can encourage,
            motivate, and learn from each other.{" "}
          </li>
          <li className="lg:text-xl text-lg my-2">
            {" "}
            <h3 className="font-semibold my-1"> Quality Content</h3> We aim to
            provide a platform for high-quality, engaging, and informative
            content that resonates with our readers.
          </li>
        </ul>
      </div>
      <div className="p-4">
        <h1 className="lg:text-4xl font-semibold text-blue-800 text-2xl  text-center">
          Get in touch
        </h1>
        <p className="lg:text-xl text-lg my-2">
          We'd love to hear from you! Whether you're a writer looking to join
          our community or just want to say hello, please don't hesitate to
          contact us:
        </p>
        <p className="lg:text-xl text-lg ">
          <span className="font-semibold pr-2">Email:</span>
          support@scribespace.com
        </p>

        <p className="lg:text-xl text-lg ">
          <span className="font-semibold pr-2">Twitter:</span>@scribespace
        </p>

        <p className="lg:text-xl text-lg ">
          <span className="font-semibold pr-2">Facebook:</span>@scribespace
        </p>
      </div>
    </div>
  );
}

export default About;
