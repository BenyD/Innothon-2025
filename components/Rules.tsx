const Rules = () => {
  return (
    <section id="rules" className="py-20 px-4 bg-gray-900 bg-opacity-50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Event Rules & Guidelines
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-semibold mb-2">General Rules</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>All participants must be currently enrolled students.</li>
              <li>
                Valid college ID is required for registration and participation.
              </li>
              <li>
                Participants must adhere to the code of conduct throughout the
                event.
              </li>
              <li>
                The decision of the judges and organizers will be final and
                binding.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              Participation Guidelines
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Registration is mandatory for all events.</li>
              <li>
                Participants can register for multiple events, but should ensure
                there are no time conflicts.
              </li>
              <li>
                Team events require all team members to be present during the
                event.
              </li>
              <li>
                Use of unfair means will result in immediate disqualification.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-2">
              Event Specific Rules
            </h3>
            <p>
              Please refer to the individual event details for specific rules
              and guidelines.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rules;
