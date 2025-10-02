import React, { useState, useEffect } from "react";
import axios from "axios";

const HealthcarePartners = () => {
  const [partners, setPartners] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { "x-auth-token": token },
      };

      const [partnersRes, prescriptionsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/healthcare/partners", config),
        axios.get(
          "http://localhost:5000/api/healthcare/my-prescriptions",
          config
        ),
      ]);

      setPartners(partnersRes.data);
      setPrescriptions(prescriptionsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching healthcare data:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            🏥 Healthcare Partners
          </h1>
          <p className="text-gray-600 text-lg">
            Doctor-prescribed gamified wellness interventions
          </p>
        </div>

        {/* My Prescriptions */}
        {prescriptions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              📋 My Prescribed Challenges
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {prescriptions.map((prescription) => (
                <div
                  key={prescription._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border-l-4 border-blue-500"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">
                          {prescription.challenge.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Prescribed by {prescription.partner.name}
                        </p>
                      </div>
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        PRESCRIBED
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4">
                      {prescription.challenge.description}
                    </p>

                    {prescription.notes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                        <p className="text-xs font-semibold text-yellow-800 mb-1">
                          Doctor's Notes:
                        </p>
                        <p className="text-sm text-yellow-700">
                          {prescription.notes}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>Duration: {prescription.duration} days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>
                          {new Date(
                            prescription.prescriptionDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-center py-3 rounded-xl font-semibold">
                      View Challenge Details
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Healthcare Partners List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            🏥 Verified Healthcare Partners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner) => (
              <div
                key={partner._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-2xl">
                    🏥
                  </div>
                  {partner.credentials.verified && (
                    <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <span>✓</span> Verified
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xl text-gray-800 mb-2">
                  {partner.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4 capitalize">
                  {partner.type.replace("_", " ")}
                </p>

                {partner.specialization &&
                  partner.specialization.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-600 mb-2">
                        Specializations:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {partner.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                {partner.contactInfo && (
                  <div className="text-sm text-gray-600 space-y-1">
                    {partner.contactInfo.email && (
                      <p className="flex items-center gap-2">
                        <span>📧</span>
                        <span>{partner.contactInfo.email}</span>
                      </p>
                    )}
                    {partner.contactInfo.phone && (
                      <p className="flex items-center gap-2">
                        <span>📞</span>
                        <span>{partner.contactInfo.phone}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">
            🩺 How Healthcare Partnership Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl mb-3">👨‍⚕️</div>
              <h4 className="font-bold mb-2">Doctor Prescribes</h4>
              <p className="text-sm text-blue-100">
                Your healthcare provider prescribes personalized wellness
                challenges
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">📱</div>
              <h4 className="font-bold mb-2">You Complete</h4>
              <p className="text-sm text-blue-100">
                Track progress and complete challenges through the app
              </p>
            </div>
            <div>
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold mb-2">Doctor Monitors</h4>
              <p className="text-sm text-blue-100">
                Your doctor can track your progress and adjust as needed
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthcarePartners;
