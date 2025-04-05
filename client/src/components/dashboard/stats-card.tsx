import { ReactNode } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  changeValue?: string | number;
  changeDirection?: "up" | "down" | "neutral";
  changeText?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  iconBgColor,
  iconColor,
  changeValue,
  changeDirection = "neutral",
  changeText,
}: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBgColor)}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                {changeValue && (
                  <div
                    className={cn(
                      "ml-2 flex items-baseline text-sm font-semibold",
                      changeDirection === "up" && "text-green-600",
                      changeDirection === "down" && "text-red-600",
                      changeDirection === "neutral" && "text-gray-600"
                    )}
                  >
                    {changeDirection === "up" && (
                      <ArrowUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                    )}
                    {changeDirection === "down" && (
                      <ArrowDown className="self-center flex-shrink-0 h-5 w-5 text-red-500" />
                    )}
                    <span className="sr-only">
                      {changeDirection === "up" ? "Increased by" : "Decreased by"}
                    </span>
                    {changeValue}
                  </div>
                )}
              </dd>
              {changeText && <div className="mt-1 text-sm text-gray-500">{changeText}</div>}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
