
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card'
import { subscriptionPlans } from '@/utils/plans/index'
import { SubscriptionButton } from './subscription-button'
import { CheckCircle, Star } from 'lucide-react'

export function GridPlans() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
      {subscriptionPlans.map((plan, index) => (
        <Card
          key={plan.id}
          className={`flex flex-col w-full mx-auto min-h-[600px] ${index === 1 && "border-emerald-500 shadow-lg"}`}
        >
          {index === 1 && (
            <div className='bg-gradient-to-r from-emerald-500 to-teal-500 w-full py-3 text-center rounded-t-xl relative'>
              <p className='font-semibold text-white text-sm'>🔥 MAIS POPULAR - PROMOÇÃO EXCLUSIVA</p>
              <div className="absolute -right-2 top-2">
                <div className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full transform rotate-12">
                  MELHOR OFERTA
                </div>
              </div>
            </div>
          )}

          <CardHeader>
            <CardTitle className='text-xl md:text-2xl'>
              {plan.name}
            </CardTitle>
            <CardDescription>
              {plan.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-1">
            <div className='mb-6'>
              <p className='text-gray-600 line-through text-lg'>{plan.oldPrice}</p>
              <p className='text-black text-2xl font-bold'>{plan.price}</p>
              <p className='text-sm text-gray-500'>por mês</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-emerald-500" />
                <h4 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                  Serviços Incluídos
                </h4>
              </div>
              <ul className="space-y-2.5">
                {plan.features.map((feature, index) => (
                  <li key={index} className='text-sm text-gray-700 flex items-start'>
                    <CheckCircle className="w-4 h-4 text-emerald-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

          </CardContent>
          <CardFooter>
            <SubscriptionButton
              type={plan.id === "BASIC" ? "BASIC" : "PROFESSIONAL"}
            />
          </CardFooter>
        </Card>
      ))}
    </section>
  )
}