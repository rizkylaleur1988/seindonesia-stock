The reasoning of your interpretation and choices you made in section 2
1. Initiation: A manager starts a stock opname session. Some things you might consider:
    When a manager initiates a session, what should happen? 
        before starts a stock opname session
    Regarding the stock, how should the stock be maintained? Should it be per store or in total?
        both
    Is initiation even necessary or should a stock opname just use the current date? What are the pros/cons to this approach?
        system can be doing 2 options
        a. manager can initiate new product without entering quantity, then staff can start stock opname with new product
        b. staff can start stock opname
        System can detect which product on the list or not on store
        pros: stock opname can be performed faster because no need initiation from manager when new product is coming
        cons: if staff entering incorrect product, the product include in the store when manager approved
2. Count Submission: Staff submit counts for some or all items in the stock opname session in a single batch. Some things you might consider:
    Does this submission change stock right away? 
        when manager approved submission
    What if a submission includes multiple of the same item? 
        Submission cannot create when have multiple item at the same time
    Is it necessary for staff to be able to edit their submission? 
        Yes, when submission status is DRAFT or submission does not send to manager
    Is it possible or necessary or allowed for staff to submit multiple submissions? 
        No
    Are there concerns if there are a large number of items in stock opname session?
        How the operational workflow, they counting manual or with scan barcode
    Other edge cases.
        Incorrect shift when staf entering stock opname
3. Approval: After staff submits a stock opname session for their store, the manager then reviews then approves/rejects the submission. Some things you might consider:
    What happens when the manager approves a submission?
        Stock on product already updated
    What if the process after approval takes a long time to finish?
        Staff cannot create new submission for the next shift
    What if the process after approval fails?
        Stock on product cannot be update and staff will create new submission
    What happens if the manager approves multiple submissions from the same store with different values?
        System can only one submission per store
    What should the manager do if they review and don’t agree with the submission?
        Manager will ask staff to create new submission with correct data
    Other edge cases.

    

Walk through what happens from the moment a manager clicks approve to the moment stock levels are updated. What could go wrong at each step, and what did you consider and do about it?
    Stock on Store already update -> Stock on Product already update -> submission status APPROVED
    if go wrong at each step data rollback
What happens to items that are left uncounted by the staff during a stock opname session? For example, if they forget or if the items don’t exist in their store. Do you allow submission with empty value for items? Do you treat them as zero stock, ignore them (keep previous stock), or handle them another way? And what is your reasoning?
    Stock product not updated
What are some edge cases you thought of and how did you handle them?
    Product not listed on store
What is one thing you added to this project that you think is important? Why?
    Staff can entering all product on their store without waiting manager, it can be more faster than wait manager to initiate