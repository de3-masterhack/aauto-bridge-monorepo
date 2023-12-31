import {
  Client,
  ISendUserOperationOpts,
  IUserOperation,
  UserOperationBuilder,
} from 'userop'

import { NextRequest, NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse('', {
    status: 200,
    headers: corsHeaders,
  })
}

export async function POST(req: NextRequest) {
  const client = await Client.init(process.env.STACKUP_RPC_URL as string)

  if (req.body == null) {
    return new NextResponse('', { status: 400, headers: corsHeaders })
  }

  const reqBody: IUserOperation = await req.json()
  const opts: ISendUserOperationOpts = {
    // dryRun: true,
    // onBuild: (op) => console.log('Signed UserOperation:', op),
  }

  const builder = new UserOperationBuilder().useDefaults(reqBody)

  try {
    const response = await client.sendUserOperation(builder, opts)
    const userOperationEvent = await response.wait()
    if (userOperationEvent == null) {
      return new NextResponse('cannot catch userOperationEvent', {
        status: 500,
        headers: corsHeaders,
      })
    }
    const receipt = await userOperationEvent?.getTransactionReceipt()
    return new NextResponse(
      JSON.stringify({ txHash: receipt.transactionHash }),
      {
        status: 200,
        headers: corsHeaders,
      },
    )
  } catch (e) {
    if (e instanceof Error) {
      return new NextResponse(JSON.stringify({ error: e.message }), {
        status: 500,
        headers: corsHeaders,
      })
    }
  }
}
