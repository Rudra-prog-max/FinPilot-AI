import { useEffect, useState } from "react";
import { Lightbulb } from "lucide-react";

import {
  getInsights,
  type Insight,
} from "../../services/insightService";


export default function AIInsights() {

  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchInsights = async () => {

      try {

        const data = await getInsights();
        setInsights(data);

      } catch (error) {

        console.error(
          "Failed to load AI insights:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchInsights();

  }, []);



  return (

    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">

      <div className="flex items-center gap-3 mb-4">

        <Lightbulb size={28} />

        <h2 className="text-2xl font-bold">
          AI Insights
        </h2>

      </div>



      {loading ? (

        <p>
          Generating insights...
        </p>

      ) : (

        <div className="space-y-3">

          {insights.map((insight, index) => (

            <p key={index}>
              💡 {insight.message}
            </p>

          ))}

        </div>

      )}

    </div>

  );
}