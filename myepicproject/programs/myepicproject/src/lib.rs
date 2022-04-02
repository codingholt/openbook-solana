use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod myepicproject {
    use super::*;
    pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> Result <()> {
        //get account reference
        let base_account =&mut ctx.accounts.base_account;

        //init total_texts.
        base_account.total_texts = 0;
        Ok(())
    }

        pub fn add_text(ctx: Context<AddText>, submitted_text: String) -> Result <()> {
          // Get a reference to the account & user
        let base_account = &mut ctx.accounts.base_account;
        let user = &mut ctx.accounts.user;

        //build the struct.
        let item = ItemStruct {
            submitted_text: submitted_text.to_string(),
            user_address: *user.to_account_info().key,
        };

        //add to text_list vector
        base_account.text_list.push(item);
        base_account.total_texts += 1;
        Ok(())
    }
}

//Attach certain variables to the StartStuffOff context
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>
}

//Specify what data we want in the AddText context
#[derive(Accounts)]
pub struct AddText<'info> {
    #[account(mut)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
}

//create custom struct
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct{
    pub submitted_text: String,
    pub user_address: Pubkey,
}

#[account]
pub struct BaseAccount {
    pub total_texts: u64,
    pub text_list: Vec<ItemStruct>
}
