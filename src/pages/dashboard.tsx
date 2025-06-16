import React, { useState } from "react";
import {
  Search,
  TrendingUp,
  X,
  Utensils,
  Target,
  ChefHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardHeader from "@/component/header";
import { useSnackbar } from "@/component/SnackbarContext";
import { BASE_URL } from "@/component/auth";

interface CalorieResult {
  id: number;
  dish_name: string;
  servings: number;
  calories_per_serving: number;
  total_calories: number;
  source: string;
}



const Dashboard = () => {
  const [dishName, setDishName] = useState("");
  const [servings, setServings] = useState(1);
  const [results, setResults] = useState<CalorieResult[]>([]);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async () => {
  if (!dishName.trim()) return;

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      showSnackbar("Authentication required. Please log in.", "error");
      setLoading(false);
      return;
    }

    const response = await fetch(
      `${BASE_URL}/get-calories`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dish_name: dishName,
          servings: servings,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData?.error || "No dish available";
      showSnackbar(errorMessage, "error");
      setLoading(false);
      return
    }

    const data = await response.json();

    const result: CalorieResult = {
      id: Date.now(),
      dish_name: data.dish_name,
      servings: data.servings,
      calories_per_serving: data.calories_per_serving,
      total_calories: data.total_calories,
      source: data.source,
    };

    setResults((prev) => [result, ...prev]);
    setDishName("");
    setServings(1);
    showSnackbar("Calories retrieved successfully!");
  } catch {
    showSnackbar("An unexpected error occurred.", "error");
  } finally {
    setLoading(false);
  }
};

  const clearResults = () => {
    setResults([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSampleDishClick = (dish: string) => {
    setDishName(dish);
    setServings(1);
  };

  const sampleDishes = [
    "chicken salad",
    "pasta carbonara",
    "grilled salmon",
    "vegetable curry",
    "beef burger",
    "caesar salad",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <DashboardHeader />
      
      <div className="flex flex-col items-center px-4 py-8">
        <div className="text-center mb-8 w-full">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="h-12 w-12 text-[#02053d]" />
            <h1 className="text-4xl font-bold text-[#02053d] drop-shadow-md">
              Calorie Tracker Dashboard
            </h1>
          </div>
          <p className="text-xl text-[#02053d]/90">
            Track calories for your favorite dishes
          </p>
        </div>

        <Card className="w-full max-w-4xl mb-8 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Enter dish name (e.g., chicken salad)"
                  value={dishName}
                  onChange={(e) => setDishName(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <Input
                type="number"
                placeholder="Number of servings"
                value={servings}
                onChange={(e) =>
                  setServings(Math.max(1, parseInt(e.target.value) || 1))
                }
                onKeyPress={handleKeyPress}
                min={1}
                max={10}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleSubmit}
                disabled={loading || !dishName.trim()}
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Getting Calories...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Get Calories
                  </>
                )}
              </Button>
              
              {results.length > 0 && (
                <Button variant="outline" onClick={clearResults}>
                  <X className="mr-2 h-4 w-4" />
                  Clear All
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="w-full max-w-4xl mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-8 w-8 text-[#02053d]" />
              <h2 className="text-3xl font-bold text-[#02053d]">Calorie Results</h2>
              <Badge variant="secondary" className="bg-white/20 text-[#02053d] border-0">
                {results.length} {results.length === 1 ? "result" : "results"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <Card key={result.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ChefHat className="h-5 w-5 text-blue-600" />
                      {result.dish_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Servings:</span>
                      <Badge variant="outline">{result.servings}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Per Serving:</span>
                      <span className="font-semibold text-orange-600">
                        {result.calories_per_serving} cal
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between border-t pt-3">
                      <span className="font-medium">Total Calories:</span>
                      <div className="flex items-center gap-1">
                        <Target className="h-4 w-4 text-red-500" />
                        <span className="text-xl font-bold text-red-600">
                          {result.total_calories}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
                      <span>Source: {result.source}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <Card className="w-full max-w-4xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-blue-600" />
              Try these sample dishes:
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sampleDishes.map((dish) => (
                <Badge
                  key={dish}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 capitalize px-3 py-1"
                  onClick={() => handleSampleDishClick(dish)}
                >
                  {dish}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;